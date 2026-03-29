export default function BrandMark({ compact = false }) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-2 bg-indigo-500" />
        <div className="absolute top-1.5 left-2 w-1 h-1 rounded-full bg-white/90" />
        <div className="absolute top-1.5 right-2 w-1 h-1 rounded-full bg-white/90" />
        <div className="mt-1 text-[11px] font-bold tracking-[0.18em] text-white">CAL</div>
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-sm font-bold text-gray-900 tracking-tight">Cal Clone</div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-gray-400">Scheduling</div>
        </div>
      )}
    </div>
  );
}
