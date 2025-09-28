export type KeyResultType = 'PERCENTAGE' | 'NUMERIC' | 'CURRENCY';
export type ObjectiveStatus = 'on-track' | 'at-risk' | 'off-track' | 'completed' | 'did-not-meet';
export interface KeyResult {
  id?: string;
  title: string;
  howItIsMeasured: string;
  type: KeyResultType;
  startValue: number;
  targetValue: number;
  currentValue: number;
}
export interface Objective {
  id?: string;
  title: string;
  description: string;
  owner: string;
  whyIsImportant?: string;
  status?: ObjectiveStatus;
  keyResults: KeyResult[];
  q2StatusUpdate?: string;
  q3StatusUpdate?: string;
  finalStatusUpdate?: string;
}