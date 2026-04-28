import { cn } from "./utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("skeleton rounded-md", className)}
      {...props}
    />
  );
}

// Pre-made skeleton variants for common UI patterns
function SkeletonCard() {
  return (
    <div className="p-4 rounded-xl shadow-premium-sm" style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)' }}>
      <div className="flex gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3.5 w-11/12" />
        </div>
      </div>
    </div>
  );
}

function SkeletonVendorCard() {
  return (
    <div className="p-4 rounded-xl shadow-card accent-border-left" style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)' }}>
      <div className="flex gap-4">
        <Skeleton className="w-16 h-16 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4.5 w-3/5" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-4 w-15" />
          </div>
          <Skeleton className="h-3.5 w-4/5" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBookingCard() {
  return (
    <div className="p-4 rounded-xl shadow-card accent-border-left" style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)' }}>
      <div className="flex gap-4">
        <Skeleton className="w-16 h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4.5 w-1/2" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3.5 w-2/5" />
          <Skeleton className="h-3.5 w-7/10" />
          <div className="flex gap-2 mt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-15 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCategoryCard() {
  return (
    <div className="p-6 rounded-xl flex flex-col items-center gap-3 shadow-premium-sm" style={{ backgroundColor: 'var(--card)', border: '1px solid rgba(46, 122, 217, 0.08)' }}>
      <Skeleton className="w-16 h-16 rounded-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20"
  };
  return <Skeleton className={cn("rounded-full", sizeClasses[size])} />;
}

function SkeletonButton() {
  return <Skeleton className="h-11 w-30 rounded-xl" />;
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonVendorCard,
  SkeletonBookingCard,
  SkeletonCategoryCard,
  SkeletonText,
  SkeletonAvatar,
  SkeletonButton
};
