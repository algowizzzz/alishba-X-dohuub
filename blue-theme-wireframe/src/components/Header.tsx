import { ArrowLeft } from 'lucide-react';
import type { Screen } from '../App';
import type { ReactNode } from 'react';

interface HeaderProps {
  title: string;
  /** Optional back button - pass the screen to navigate to */
  onBack?: () => void;
  /** Optional right side content (buttons, icons, etc.) */
  rightContent?: ReactNode;
  /** Optional left side content (replaces back button if provided) */
  leftContent?: ReactNode;
}

export function Header({ title, onBack, rightContent, leftContent }: HeaderProps) {
  return (
    <div
      className="px-6 py-6 relative z-10"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.06)',
        borderBottom: '1px solid rgba(46, 122, 217, 0.08)',
        borderRadius: '0 0 24px 24px',
      }}
    >
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          {leftContent ? (
            leftContent
          ) : onBack ? (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-xl transition-all duration-300 hover:bg-gray-100 active:scale-95"
            >
              <ArrowLeft className="w-6 h-6" style={{ color: 'var(--foreground)' }} />
            </button>
          ) : null}

          <h1
            className="font-semibold tracking-tight"
            style={{
              color: 'var(--foreground)',
              fontSize: '20px',
              fontWeight: 600,
            }}
          >
            {title}
          </h1>
        </div>

        {/* Right side */}
        {rightContent && (
          <div className="flex items-center gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}
