import { Hono } from "hono";
import { Env } from './core-utils';
import { v4 as uuidv4 } from 'uuid';
import { Objective, KeyResult, ObjectiveStatus } from '../src/types';
// In-memory store to simulate a database
let okrs: Objective[] = [
    {
        id: 'obj_1',
        title: 'Launch Q3 Marketing Campaign',
        description: 'Execute a multi-channel marketing campaign to boost brand awareness and lead generation for the new product line.',
        owner: 'Marketing Team',
        whyIsImportant: 'This campaign is critical for establishing market presence for our new flagship product and achieving our revenue targets for the second half of the year.',
        status: 'on-track',
        q2StatusUpdate: 'Campaign planning complete. All assets are ready for launch. Initial outreach has begun with positive feedback.',
        q3StatusUpdate: 'Campaign is live across all channels. Lead generation is exceeding targets by 15%. Website traffic is up 18%.',
        keyResults: [
            { id: 'kr_1_1', title: 'Increase website traffic by 20%', howItIsMeasured: 'Measured by Google Analytics unique visitors.', type: 'PERCENTAGE', startValue: 0, targetValue: 20, currentValue: 15 },
            { id: 'kr_1_2', title: 'Generate 500 new MQLs', howItIsMeasured: 'Tracked via HubSpot form submissions.', type: 'NUMERIC', startValue: 0, targetValue: 500, currentValue: 350 },
            { id: 'kr_1_3', title: 'Achieve a 5% conversion rate on landing pages', howItIsMeasured: 'A/B test results from Optimizely.', type: 'PERCENTAGE', startValue: 0, targetValue: 5, currentValue: 4.2 },
        ],
    },
    {
        id: 'obj_2',
        title: 'Enhance Customer Onboarding Experience',
        description: 'Improve the initial user experience to increase activation rates and reduce early-stage churn.',
        owner: 'Product Team',
        whyIsImportant: 'A seamless onboarding is key to user retention. Improving this flow will directly impact long-term customer satisfaction and reduce support costs.',
        status: 'at-risk',
        q2StatusUpdate: 'Initial user testing of the new onboarding flow revealed some friction points. Iterating on designs before full implementation.',
        keyResults: [
            { id: 'kr_2_1', title: 'Reduce onboarding drop-off rate to 10%', howItIsMeasured: 'Funnel analysis in Mixpanel.', type: 'PERCENTAGE', startValue: 25, targetValue: 10, currentValue: 12 },
            { id: 'kr_2_2', title: 'Increase user activation rate by 15%', howItIsMeasured: 'Calculated as users completing key action X within 3 days.', type: 'PERCENTAGE', startValue: 0, targetValue: 15, currentValue: 10 },
        ],
    },
    {
        id: 'obj_3',
        title: 'Strengthen Engineering Infrastructure',
        description: 'Improve system reliability and performance to support growing user demand and ensure a stable platform.',
        owner: 'Engineering Team',
        whyIsImportant: 'A robust and scalable infrastructure is the foundation of our service. This work ensures we can maintain a high-quality user experience as we grow.',
        status: 'on-track',
        q2StatusUpdate: 'Migrated primary database to a new cluster with zero downtime. Performance metrics are stable.',
        q3StatusUpdate: 'Implemented new caching layer, resulting in a 20% decrease in average API response time. Uptime remains solid.',
        finalStatusUpdate: 'All infrastructure goals met. System is stable and scalable for the next 12 months.',
        keyResults: [
            { id: 'kr_3_1', title: 'Achieve 99.9% uptime', howItIsMeasured: 'Monitored via Datadog SLOs.', type: 'PERCENTAGE', startValue: 99.5, targetValue: 99.9, currentValue: 99.85 },
            { id: 'kr_3_2', title: 'Decrease average API response time to 150ms', howItIsMeasured: 'P95 latency measured by Cloudflare Analytics.', type: 'NUMERIC', startValue: 250, targetValue: 150, currentValue: 180 },
            { id: 'kr_3_3', title: 'Resolve 50 P1/P2 bugs', howItIsMeasured: 'Count of tickets closed in Jira.', type: 'NUMERIC', startValue: 0, targetValue: 50, currentValue: 45 },
        ],
    },
];
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    // GET all OKRs
    app.get('/api/okrs', (c) => {
        return c.json({ success: true, data: okrs });
    });
    // POST a new OKR
    app.post('/api/okrs', async (c) => {
        const body = await c.req.json();
        const newObjective: Objective = {
            ...body,
            id: uuidv4(),
            status: 'on-track', // Default status for new objectives
            keyResults: body.keyResults.map((kr: Omit<KeyResult, 'id'>) => ({ ...kr, id: uuidv4() })),
        };
        okrs.push(newObjective);
        return c.json({ success: true, data: newObjective }, 201);
    });
    // PUT (update) an existing OKR
    app.put('/api/okrs/:id', async (c) => {
        const id = c.req.param('id');
        const body = await c.req.json<Objective>();
        const index = okrs.findIndex(o => o.id === id);
        if (index === -1) {
            return c.json({ success: false, error: 'Objective not found' }, 404);
        }
        const updatedKeyResults = body.keyResults.map(kr => ({
            ...kr,
            id: kr.id || uuidv4()
        }));
        const updatedObjective = { ...okrs[index], ...body, keyResults: updatedKeyResults };
        okrs[index] = updatedObjective;
        return c.json({ success: true, data: updatedObjective });
    });
    // PATCH an OKR's status
    app.patch('/api/okrs/:id/status', async (c) => {
        const id = c.req.param('id');
        const { status } = await c.req.json<{ status: ObjectiveStatus }>();
        const index = okrs.findIndex(o => o.id === id);
        if (index === -1) {
            return c.json({ success: false, error: 'Objective not found' }, 404);
        }
        okrs[index].status = status;
        return c.json({ success: true, data: okrs[index] });
    });
    // DELETE an OKR
    app.delete('/api/okrs/:id', (c) => {
        const id = c.req.param('id');
        const initialLength = okrs.length;
        okrs = okrs.filter(o => o.id !== id);
        if (okrs.length === initialLength) {
            return c.json({ success: false, error: 'Objective not found' }, 404);
        }
        return c.json({ success: true, data: { id } });
    });
}