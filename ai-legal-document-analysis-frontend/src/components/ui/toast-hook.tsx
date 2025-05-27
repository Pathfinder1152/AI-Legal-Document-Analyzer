'use client';

import * as React from 'react';
import { ToastPrimitive } from '@/components/ui/toast';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  title?: string;
  description?: string;
  type?: ToastVariant;
  duration?: number;
}

type Toast = ToastProps & {
  id: string;
};

interface ToastContextValue {
  toasts: Toast[];
  showToast: (props: ToastProps) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export function ToastManager({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const showToast = React.useCallback(
    ({ title, description, type = 'default', duration = 5000 }: ToastProps) => {
      const id = Math.random().toString(36).substring(2, 9);
      
      const newToast = {
        id,
        title,
        description,
        type,
        duration,
      };
      
      setToasts((prev) => [...prev, newToast]);
      
      if (duration !== Infinity) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
      
      return id;
    },
    []
  );

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
      <ToastPrimitive.Provider>
        {children}        <ToastPrimitive.Viewport className="fixed right-0 top-0 z-[100] flex max-h-screen w-full flex-col-reverse gap-2 p-4 md:max-w-[420px]" />
        {toasts.map(({ id, title, description, type }) => (
          <ToastPrimitive.Root
            key={id}
            onOpenChange={(open) => {
              if (!open) dismissToast(id);
            }}
            className={`
              group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all
              data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
              data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80
              data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full md:data-[state=open]:slide-in-from-right-full
              ${
                type === 'success' 
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                  : type === 'error'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : type === 'warning'
                  ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  : type === 'info'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-border bg-background'
              }
            `}
          >
            <div className="grid gap-1">
              {title && <ToastPrimitive.Title className="text-sm font-semibold">{title}</ToastPrimitive.Title>}
              {description && (
                <ToastPrimitive.Description className="text-sm opacity-90">
                  {description}
                </ToastPrimitive.Description>
              )}
            </div>
            <ToastPrimitive.Close className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
              >
                <path
                  d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                  fill="currentColor"
                />
              </svg>            </ToastPrimitive.Close>
          </ToastPrimitive.Root>
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
