import React from 'react';
import { Inbox, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-charcoal-200 my-4">
      <div className="w-14 h-14 rounded-2xl bg-pastel-50 border border-pastel-200 flex items-center justify-center text-pastel-600 mb-4 shadow-sm">
        <Inbox className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-charcoal-800 mb-1">{title}</h3>
      <p className="text-sm text-charcoal-500 max-w-sm mb-5">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-pastel-700 hover:bg-pastel-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
