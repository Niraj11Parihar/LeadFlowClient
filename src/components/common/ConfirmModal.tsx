import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import {
  AlertTriangleIcon as AlertTriangle,
  XIcon as X,
  TrashIcon as Trash2,
  CheckCircleIcon as CheckCircle2,
  AlertCircleIcon as AlertCircle,
} from '../../assets/SVGicons';

export type ConfirmVariant = 'danger' | 'warning' | 'primary' | 'info';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  icon,
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Variant design styles
  const variantStyles = {
    danger: {
      badgeBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
      confirmVariant: 'danger' as const,
      defaultIcon: <Trash2 className="w-5 h-5" />,
    },
    warning: {
      badgeBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
      confirmVariant: 'secondary' as const,
      defaultIcon: <AlertTriangle className="w-5 h-5" />,
    },
    primary: {
      badgeBg: 'bg-brand-50 text-brand-600 border-brand-200/80',
      confirmVariant: 'primary' as const,
      defaultIcon: <CheckCircle2 className="w-5 h-5" />,
    },
    info: {
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200/80',
      confirmVariant: 'secondary' as const,
      defaultIcon: <AlertCircle className="w-5 h-5" />,
    },
  };

  const style = variantStyles[variant] || variantStyles.warning;
  const displayIcon = icon || style.defaultIcon;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-dropdown border border-slate-200 overflow-hidden transform transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Badge Icon & Header */}
          <div className="flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center border shrink-0 ${style.badgeBg}`}
            >
              {displayIcon}
            </div>
            <div className="flex-1 pr-4">
              <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">{title}</h3>
              {description && (
                <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{description}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              variant={style.confirmVariant}
              size="sm"
              isLoading={isLoading}
              onClick={async () => {
                await onConfirm();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
