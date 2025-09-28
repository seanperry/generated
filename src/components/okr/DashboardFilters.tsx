import React from 'react';
import { useOkrStore } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity } from 'lucide-react';
import { ObjectiveStatus } from '@/types';
const statuses: (ObjectiveStatus | 'all')[] = ['all', 'on-track', 'at-risk', 'off-track', 'completed', 'did-not-meet'];
export const DashboardFilters: React.FC = () => {
  const okrs = useOkrStore((state) => state.okrs);
  const uniqueOwners = React.useMemo(() => [...new Set(okrs.map(o => o.owner))], [okrs]);
  const ownerFilter = useOkrStore((state) => state.ownerFilter);
  const setOwnerFilter = useOkrStore((state) => state.setOwnerFilter);
  const statusFilter = useOkrStore((state) => state.statusFilter);
  const setStatusFilter = useOkrStore((state) => state.setStatusFilter);
  return (
    <Card className="bg-white dark:bg-kelly-charcoal/90 border-gray-200 dark:border-gray-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-kelly-charcoal dark:text-gray-100">Filters</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="flex items-center text-base font-medium text-gray-700 dark:text-gray-300">
            <Users className="mr-2 h-5 w-5 text-kelly-green" />
            Filter by Owner
          </Label>
          <Select value={ownerFilter} onValueChange={setOwnerFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Owners" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Owners</SelectItem>
              {uniqueOwners.map(owner => (
                <SelectItem key={owner} value={owner}>{owner}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <Label className="flex items-center text-base font-medium text-gray-700 dark:text-gray-300">
            <Activity className="mr-2 h-5 w-5 text-kelly-orange" />
            Filter by Status
          </Label>
          <RadioGroup
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as ObjectiveStatus | 'all')}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2"
          >
            {statuses.map(status => (
              <div key={status} className="flex items-center space-x-2">
                <RadioGroupItem value={status} id={status} />
                <Label htmlFor={status} className="capitalize">{status.replace('-', ' ')}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};