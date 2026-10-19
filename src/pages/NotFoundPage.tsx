import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="w-16 h-16 rounded-2xl bg-navy-100 text-navy-950 flex items-center justify-center mb-4 border border-navy-200">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-navy-950 tracking-tight mb-2">Page Not Found</h1>
      <p className="text-sm text-slate-500 max-w-md mb-6">
        The requested university portal route does not exist. Please check your navigation path or return to your portal home.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-950 hover:bg-navy-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Portal Home
      </Link>
    </div>
  );
};
