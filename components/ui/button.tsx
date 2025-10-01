import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md rounded-lg',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md rounded-lg',
        outline:
          'border-2 border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-400 rounded-lg shadow-sm',
        secondary:
          'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md rounded-lg',
        ghost: 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg',
        link: 'text-blue-600 underline-offset-4 hover:underline hover:text-blue-800',

        // Enhanced luxury variants
        luxury: 'btn-luxury rounded-xl text-white font-semibold',
        gold: 'btn-gold rounded-xl text-white font-semibold',
        royal: 'btn-royal rounded-xl text-white font-semibold',
        teal: 'btn-teal rounded-xl text-white font-semibold',

        // Glass variants
        glass: 'bg-white/90 backdrop-blur-md text-gray-900 hover:bg-white rounded-xl border border-gray-200',
        'glass-dark': 'bg-gray-900/90 backdrop-blur-md text-white hover:bg-gray-800 rounded-xl border border-gray-700',

        // Status variants
        success: 'bg-green-600 text-white hover:bg-green-700 rounded-lg',
        warning: 'bg-amber-600 text-white hover:bg-amber-700 rounded-lg',
        error: 'bg-red-600 text-white hover:bg-red-700 rounded-lg',
        info: 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg',

        // Minimal variants
        minimal: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:shadow-sm rounded-lg',
        elevated: 'bg-white text-gray-900 shadow-lg hover:shadow-xl hover:-translate-y-0.5 rounded-xl border border-gray-200',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4 py-2 text-sm',
        lg: 'h-12 px-6 py-3 text-base',
        xl: 'h-14 px-8 py-4 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    asChild = false,
    loading = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="loading-luxury w-4 h-4 mr-2" />
        )}
        {!loading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };