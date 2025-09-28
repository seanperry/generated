import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Objective, ObjectiveStatus } from "@/types";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const calculateOverallProgress = (objective: Objective): number => {
  if (!objective.keyResults || objective.keyResults.length === 0) {
    return 0;
  }
  const totalProgress = objective.keyResults.reduce((sum, kr) => {
    let progress = 0;
    if (kr.targetValue !== kr.startValue) {
      if (kr.startValue > kr.targetValue) { // handles decreasing values
        progress = ((kr.startValue - kr.currentValue) / (kr.startValue - kr.targetValue)) * 100;
      } else {
        progress = ((kr.currentValue - kr.startValue) / (kr.targetValue - kr.startValue)) * 100;
      }
    }
    return sum + Math.max(0, Math.min(100, progress));
  }, 0);
  return totalProgress / objective.keyResults.length;
};
export const getObjectiveStatus = (objective: Objective): ObjectiveStatus => {
  if (objective.status && (objective.status === 'completed' || objective.status === 'did-not-meet')) {
    return objective.status;
  }
  const progress = calculateOverallProgress(objective);
  if (progress >= 70) return 'on-track';
  if (progress >= 30) return 'at-risk';
  return 'off-track';
};
export const STATUS_COLORS: Record<ObjectiveStatus, { bg: string; text: string; border: string }> = {
  'on-track': { bg: 'bg-emerald-100 dark:bg-emerald-900/50', text: 'text-emerald-800 dark:text-emerald-200', border: 'border-emerald-500' },
  'at-risk': { bg: 'bg-amber-100 dark:bg-amber-900/50', text: 'text-amber-800 dark:text-amber-200', border: 'border-amber-500' },
  'off-track': { bg: 'bg-rose-100 dark:bg-rose-900/50', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-500' },
  'completed': { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-500' },
  'did-not-meet': { bg: 'bg-gray-100 dark:bg-gray-700/50', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-500' },
};