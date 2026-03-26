import React from 'react';

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

interface IconContainerProps {
  size?: IconSize;
  gradient: [string, string];
  glow?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeMap: Record<IconSize, { container: number; padding: string }> = {
  xs: { container: 32, padding: 'p-1.5' },
  sm: { container: 40, padding: 'p-2' },
  md: { container: 64, padding: 'p-4' },
  lg: { container: 96, padding: 'p-6' },
  xl: { container: 128, padding: 'p-8' },
  hero: { container: 192, padding: 'p-12' },
};

export function IconContainer({
  size = 'md',
  gradient,
  glow = false,
  className = '',
  children,
}: IconContainerProps) {
  const { container, padding } = sizeMap[size];

  return (
    <div
      className={`rounded-full flex items-center justify-center relative ${padding} ${className}`}
      style={{
        width: container,
        height: container,
        background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
        boxShadow: glow
          ? `0 4px 15px ${gradient[0]}40, 0 8px 30px ${gradient[1]}25, inset 0 1px 2px rgba(255,255,255,0.3)`
          : `0 4px 12px rgba(0,0,0,0.1), inset 0 1px 2px rgba(255,255,255,0.3)`,
      }}
    >
      {/* Inner highlight ring for glass effect */}
      <div
        className="absolute inset-[2px] rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)',
        }}
      />
      {/* Icon content */}
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export type { IconSize, IconContainerProps };
