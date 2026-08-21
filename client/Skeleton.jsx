export const SkeletonCard = () => (
  <div className="card p-5 space-y-3">
    <div className="skeleton h-3 w-24" />
    <div className="skeleton h-8 w-32" />
    <div className="skeleton h-2 w-full rounded-full" />
    <div className="skeleton h-3 w-40" />
  </div>
);

export const SkeletonRow = () => (
  <div className="card p-4 flex items-center gap-4">
    <div className="skeleton w-10 h-10 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="skeleton h-3 w-1/3" />
      <div className="skeleton h-2 w-full rounded-full" />
    </div>
  </div>
);
