import React from 'react';
import { KeyResult } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
const formatValue = (value: number, type: KeyResult['type']) => {
  switch (type) {
    case 'CURRENCY':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    case 'PERCENTAGE':
      return `${value.toFixed(1)}%`;
    case 'NUMERIC':
      return new Intl.NumberFormat('en-US').format(value);
    default:
      return value;
  }
};
const calculateProgress = (kr: KeyResult) => {
  if (kr.targetValue === kr.startValue) return 0;
  // Handle cases where startValue is greater than targetValue (e.g., reduce errors from 10 to 5)
  if (kr.startValue > kr.targetValue) {
    const progress = ((kr.startValue - kr.currentValue) / (kr.startValue - kr.targetValue)) * 100;
    return Math.max(0, Math.min(100, progress));
  }
  const progress = ((kr.currentValue - kr.startValue) / (kr.targetValue - kr.startValue)) * 100;
  return Math.max(0, Math.min(100, progress));
};
export const KeyResultItem: React.FC<{ keyResult: KeyResult }> = ({ keyResult }) => {
  const progress = calculateProgress(keyResult);
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{keyResult.title}</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <Target size={12} />
          <span>{formatValue(keyResult.targetValue, keyResult.type)}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm font-semibold text-kelly-charcoal dark:text-white w-12 text-right">{Math.round(progress)}%</span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 italic">
        {keyResult.howItIsMeasured}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Current: {formatValue(keyResult.currentValue, keyResult.type)}
      </p>
    </div>
  );
};