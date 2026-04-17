import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Calendar, ChevronRight } from 'lucide-react';

export default function HistorySidebar({ isOpen, onClose, history, onClear, onSelect }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm glass z-[101] shadow-2xl border-l border-white/5 flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Recent Scans</h2>
                <p className="text-[10px] text-text-dim uppercase tracking-widest font-mono">Archive Registry</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 glass-pill rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {history.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center px-8">
                  <Calendar className="w-12 h-12 mb-4" />
                  <p className="text-sm font-medium">No diagnostic history found. Your results will appear here.</p>
                </div>
              ) : (
                history.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onSelect(item)}
                    className="group cursor-pointer p-4 rounded-2xl glass-pill border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-left"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate text-white">{item.disease}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-text-dim font-mono">{new Date(item.timestamp).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-white/20" />
                          <span className="text-[10px] font-bold text-primary">{item.confidence}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-dim group-hover:text-white transition-colors" />
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-white/5">
              <button 
                onClick={onClear}
                disabled={history.length === 0}
                className="w-full py-3 glass-pill rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-20"
              >
                <Trash2 className="w-4 h-4" />
                Clear Local Archive
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
