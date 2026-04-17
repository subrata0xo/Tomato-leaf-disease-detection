import { Leaf, History, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header({ onToggleHistory, historyCount }) {
  return (
    <header className="sticky top-0 z-50 px-6 py-4 glass mb-8 flex items-center justify-between border-b border-white/5">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3"
      >
        <div className="bg-primary/20 p-2 rounded-xl border border-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
          <Leaf className="text-primary w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl tracking-tight leading-none bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            TomatoScan
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-primary font-mono font-medium">
            AI Diagnostics
          </p>
        </div>
      </motion.div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleHistory}
          className="relative glass-pill p-2 px-3 rounded-full flex items-center gap-2 hover:bg-white/10 transition-all active:scale-95 group"
        >
          <History className="w-4 h-4 text-text-dim group-hover:text-primary transition-colors" />
          <span className="text-xs font-medium text-text-dim">History</span>
          {historyCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-bg-main text-[10px] font-bold rounded-full flex items-center justify-center">
              {historyCount}
            </span>
          )}
        </button>
        <button className="glass-pill p-2 rounded-full hover:bg-white/10 transition-all">
          <Info className="w-4 h-4 text-text-dim" />
        </button>
      </div>
    </header>
  );
}
