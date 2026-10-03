import React from 'react';
import { useEmailContext } from '../../context/EmailContext';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEmailContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-soft-lg border border-[#E8EBF8] animate-in fade-in slide-in-from-bottom-3 duration-300"
          >
            <div className="mt-0.5 flex-shrink-0">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
              {isInfo && <Info className="w-5 h-5 text-[#635BFF]" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#EF4444]" />}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-[#13182E] leading-snug">{toast.title}</h4>
              <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#13182E] p-1 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
