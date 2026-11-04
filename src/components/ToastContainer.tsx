import React from 'react';
import { usePortal } from '../context/PortalContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = usePortal();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full no-print">
      {toasts.map(toast => {
        let icon = <Info className="w-4 h-4 text-blue-600" />;
        let borderColor = 'border-slate-200 bg-white text-slate-800';

        if (toast.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
          borderColor = 'border-emerald-200 bg-white text-slate-800';
        } else if (toast.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-600" />;
          borderColor = 'border-rose-200 bg-white text-slate-800';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
          borderColor = 'border-amber-200 bg-white text-slate-800';
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-2.5 p-3 rounded-lg border shadow-lg transition-all ${borderColor}`}
          >
            <div className="flex-shrink-0 mt-0.5">{icon}</div>
            <div className="flex-1 min-w-0 text-xs">
              <h4 className="font-bold text-slate-900">{toast.title}</h4>
              <p className="text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
