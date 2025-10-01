import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'luxury' | 'elevated' | 'glass' | 'minimal';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-xl transition-all duration-300',
      {
        'bg-card text-card-foreground border border-border shadow-sm': variant === 'default',
        'card-luxury hover:shadow-luxury-lg': variant === 'luxury',
        'card-luxury-elevated': variant === 'elevated',
        'bg-white/90 backdrop-blur-md border border-gray-200 text-foreground': variant === 'glass',
        'bg-white border border-gray-200 shadow-sm text-card-foreground hover:bg-gray-50': variant === 'minimal',
      },
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'luxury' | 'compact';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col space-y-2',
      {
        'p-6': variant === 'default',
        'p-8 pb-6': variant === 'luxury',
        'p-4': variant === 'compact',
      },
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    variant?: 'default' | 'luxury' | 'gradient';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-serif font-semibold leading-tight tracking-tight',
      {
        'text-xl md:text-2xl text-foreground': variant === 'default',
        'text-2xl md:text-3xl text-gray-900': variant === 'luxury',
        'text-xl md:text-2xl text-gray-900 font-bold': variant === 'gradient',
      },
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    variant?: 'default' | 'luxury';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'leading-relaxed',
      {
        'text-sm text-muted-foreground': variant === 'default',
        'text-base text-gray-600': variant === 'luxury',
      },
      className
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'luxury' | 'compact';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'text-gray-700',
      {
        'p-6 pt-0': variant === 'default',
        'px-8 pb-8': variant === 'luxury',
        'p-4 pt-0': variant === 'compact',
      },
      className
    )}
    {...props}
  />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'luxury' | 'compact';
  }
>(({ className, variant = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center',
      {
        'p-6 pt-0': variant === 'default',
        'px-8 pb-8 pt-0': variant === 'luxury',
        'p-4 pt-0': variant === 'compact',
      },
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };