const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent';

const CardSkeleton = () => (
  <div className="w-full space-y-4 rounded-lg border border-border bg-white p-3 shadow-sm">
    <div className={`${shimmer} h-48 w-full rounded-lg bg-muted`} />
    <div className="space-y-3">
      <div className={`${shimmer} h-3 w-3/5 rounded bg-muted`} />
      <div className={`${shimmer} h-3 w-4/5 rounded bg-muted`} />
      <div className={`${shimmer} h-3 w-2/5 rounded bg-muted`} />
    </div>
  </div>
);

export default CardSkeleton;
