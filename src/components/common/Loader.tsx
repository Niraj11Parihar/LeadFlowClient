import React from 'react';
import { LoaderIcon } from '../../assets/SVGicons';

export const Loader: React.FC<{ fullScreen?: boolean; label?: string }> = ({ fullScreen = false, label = 'Loading...' }) => {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <LoaderIcon size={40} className="text-brand-600 mb-3" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8 text-slate-500">
      <LoaderIcon size={24} className="mr-2 text-brand-600" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};
