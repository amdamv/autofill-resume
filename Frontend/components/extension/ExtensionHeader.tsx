import { Puzzle } from 'lucide-react';

export default function ExtensionHeader() {
  return (
    <div className="ext-bottombar px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
          <Puzzle
            size={16}
            className="text-indigo-400 glow-animation animate-pulse"
          />
        </div>
        <div>
          <span className="text-xs font-bold text-white block leading-tight font-display">
            JobFill extension
          </span>
          <span className="text-[9px] text-emerald-400 font-bold font-mono">
            ✦ 1-CLICK DOM ENGINE
          </span>
        </div>
      </div>

      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono font-bold px-1.5 py-0.5 rounded">
        ACTIVE
      </span>
    </div>
  );
}
