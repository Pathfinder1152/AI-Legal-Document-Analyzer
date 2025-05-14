import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  size = 'md', 
  className,
  color
}) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-t-transparent", 
        sizeMap[size],
        color ? `border-${color}` : 'border-primary',
        className
      )} 
    />
  );
};
