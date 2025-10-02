import { toast as sonnerToast } from 'sonner';

export function useToast() {
  return {
    toast: ({
      title,
      description,
      variant = 'default',
      ...props
    }: {
      title?: string;
      description?: string;
      variant?: 'default' | 'destructive' | 'success';
      duration?: number;
    }) => {
      const message = description || title || '';

      if (variant === 'destructive') {
        sonnerToast.error(title, {
          description,
          ...props,
        });
      } else if (variant === 'success') {
        sonnerToast.success(title, {
          description,
          ...props,
        });
      } else {
        sonnerToast(title, {
          description,
          ...props,
        });
      }
    },
  };
}

export { sonnerToast as toast };
