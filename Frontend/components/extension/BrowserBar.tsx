type Props = {
  selectedJobId: string;
};

export default function BrowserBar({ selectedJobId }: Props) {
  return (
    <div className="bg-panel px-4 py-3 border-b border-default/75 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="w-3 h-3 rounded-full bg-red-500/80 hover:scale-105 transition-all" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:scale-105 transition-all" />
        <span className="w-3 h-3 rounded-full bg-green-500/80 hover:scale-105 transition-all" />
      </div>

      <div className="flex-grow max-w-lg mx-4">
        <div className="bg-surface-deep border border-default rounded-lg py-1 px-4 text-[11px] text-body font-mono text-center truncate flex items-center justify-center gap-1.5 select-none">
          <span className="text-emerald-500 font-bold">https://</span>
          <span>workplace-portal.ru/vacancy/detail/{selectedJobId}</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-muted font-semibold uppercase tracking-wider hidden sm:inline">
          Tab-Mode: HTML DOM
        </span>
      </div>
    </div>
  );
}
