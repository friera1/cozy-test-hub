
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  href,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  target,
  rel,
  ariaLabel,
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/40',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary/40',
    outline: 'border border-primary bg-transparent text-primary hover:bg-primary/5 focus:ring-primary/40',
    ghost: 'bg-transparent text-foreground hover:bg-secondary focus:ring-secondary/40',
    link: 'bg-transparent text-primary underline-offset-4 hover:underline focus:ring-primary/40 p-0 h-auto',
  };

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const iconElement = icon && (
    <span className={cn(
      'transition-transform duration-300 ease-in-out',
      iconPosition === 'right' ? 'ml-2 group-hover:translate-x-1' : 'mr-2 group-hover:-translate-x-1'
    )}>
      {icon}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        className={cn(buttonClasses, 'group')}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {iconPosition === 'left' && iconElement}
        <span className="relative z-10">{children}</span>
        {iconPosition === 'right' && iconElement}
        <span className="absolute inset-0 z-0 scale-0 rounded-full bg-white/10 transition-all duration-300 ease-in-out group-hover:scale-100"></span>
      </a>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(buttonClasses, 'group')}
      aria-label={ariaLabel}
    >
      {iconPosition === 'left' && iconElement}
      <span className="relative z-10">{children}</span>
      {iconPosition === 'right' && iconElement}
      <span className="absolute inset-0 z-0 scale-0 rounded-full bg-white/10 transition-all duration-300 ease-in-out group-hover:scale-100"></span>
    </button>
  );
};

export default AnimatedButton;
