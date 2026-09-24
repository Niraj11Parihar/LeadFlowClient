import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';
import { XIcon as X } from '../../assets/SVGicons';

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

  const variantStyles = {
    danger: {
      confirmVariant: 'danger' as const,
    },
    warning: {
      confirmVariant: 'secondary' as const,
    },
    primary: {
      confirmVariant: 'primary' as const,
    },
    info: {
      confirmVariant: 'secondary' as const,
    },
  };

  const style = variantStyles[variant] || variantStyles.warning;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-[340px] bg-white rounded-2xl shadow-dropdown border border-slate-200 overflow-hidden transform transition-all p-5 sm:p-6 text-center">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-3 right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="pt-1">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight text-center">{title}</h2>
          {description && (
            <p className="text-md text-slate-500 mt-1.5 leading-relaxed text-center">{description}</p>
          )}

          <div className="flex items-center justify-center gap-2.5 mt-5 pt-4 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 min-w-[80px]"
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
              className="px-4 min-w-[80px]"
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
