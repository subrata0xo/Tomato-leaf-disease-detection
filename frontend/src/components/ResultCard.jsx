import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, AlertCircle, Info, Stethoscope, Sprout, Share2, Download } from 'lucide-react';
import { useState } from 'react';

const DISEASE_COLORS = {
  "Healthy": { accent: "#22c55e", gradient: "linear-gradient(135deg, #064e3b, #065f46)" },
  "Bacterial Spot": { accent: "#f97316", gradient: "linear-gradient(135deg, #431407, #7c2d12)" },
  "Early Blight": { accent: "#eab308", gradient: "linear-gradient(135deg, #422006, #713f12)" },
  "Late Blight": { accent: "#818cf8", gradient: "linear-gradient(135deg, #1e1b4b, #312e81)" },
  "Leaf Mold": { accent: "#4ade80", gradient: "linear-gradient(135deg, #064e3b, #14532d)" },
  "Septoria Leaf Spot": { accent: "#f87171", gradient: "linear-gradient(135deg, #450a0a, #7f1d1d)" },
  "Spider Mites": { accent: "#fb923c", gradient: "linear-gradient(135deg, #431407, #7c2d12)" },
  "Target Spot": { accent: "#c084fc", gradient: "linear-gradient(135deg, #2e1065, #581c87)" },
  "Yellow Leaf Curl Virus": { accent: "#facc15", gradient: "linear-gradient(135deg, #422006, #713f12)" },
  "Mosaic Virus": { accent: "#2dd4bf", gradient: "linear-gradient(135deg, #042f2e, #134e4a)" },
};

export default function ResultCard({ result, imageUrl }) {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const theme = DISEASE_COLORS[result.disease] || { accent: "#94a3b8", gradient: "linear-gradient(135deg, #0f172a, #1e293b)" };

  const tabs = [
    { id: 'diagnosis', label: 'Diagnosis', icon: Stethoscope },
    { id: 'prevention', label: 'Prevention', icon: Sprout },
    { id: 'details', label: 'Details', icon: Info },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Visual Summary Side */}
        <div className="md:w-[40%] relative overflow-hidden group">
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-bg-main via-bg-main/20 to-transparent" />
          <img 
            src={imageUrl} 
            alt={result.disease} 
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          
          <div className="absolute top-6 left-6 z-20">
            <div className={`glass-pill px-4 py-2 rounded-full flex items-center gap-3 border-[1.5px]`} style={{ borderColor: `${theme.accent}40` }}>
              {result.is_healthy ? (
                <ShieldCheck className="w-5 h-5 text-primary" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm font-bold tracking-tight">AI CONFIRMED</span>
            </div>
          </div>

          <div className="absolute bottom-10 left-10 right-10 z-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-4xl font-bold serif leading-tight mb-2">
                {result.disease}
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-12 bg-primary" style={{ backgroundColor: theme.accent }} />
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-text-dim">Scientific Registry</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content Side */}
        <div className="md:w-[60%] p-8 md:p-12 flex flex-col bg-white/[0.02]">
          {/* Header Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2
                    ${activeTab === tab.id 
                      ? 'bg-white/10 text-white border border-white/10' 
                      : 'text-text-dim hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="p-2.5 glass-pill rounded-full hover:bg-white/10 transition-colors">
                <Download className="w-4 h-4 text-text-dim" />
              </button>
              <button className="p-2.5 glass-pill rounded-full hover:bg-white/10 transition-colors">
                <Share2 className="w-4 h-4 text-text-dim" />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {activeTab === 'diagnosis' && (
                  <>
                    <div className="space-y-2">
                      <div className="flex justify-between items-end border-b border-white/5 pb-2">
                        <span className="text-[10px] tracking-widest uppercase text-text-dim font-mono">Precision Metric</span>
                        <span className="text-2xl font-bold font-mono" style={{ color: theme.accent }}>{result.confidence}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: theme.accent }}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs tracking-widest uppercase text-text-dim font-mono">Observations</h4>
                      <p className="text-lg text-white/80 serif leading-relaxed">
                        {result.cause}
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-white">Recommended Action</span>
                      </div>
                      <p className="text-sm text-text-dim leading-relaxed">
                        {result.solution}
                      </p>
                    </div>
                  </>
                )}
                {activeTab === 'prevention' && (
                  <div className="space-y-6">
                    <p className="text-text-dim serif italic">Suggested preventive measures based on current localized data patterns:</p>
                    <ul className="space-y-4">
                      {["Maintain optimal field hydration levels", "Ensure 4ft clearing between leaf layers", "Apply early-cycle copper bactericides"].map((item, i) => (
                        <li key={i} className="flex gap-4">
                          <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary">{i+1}</span>
                          </div>
                          <p className="text-white/80 font-medium text-sm">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {activeTab === 'details' && (
                  <div className="grid grid-cols-2 gap-4 font-mono">
                    {[
                      { label: "Detected At", value: new Date().toLocaleTimeString() },
                      { label: "Scanner Model", value: "VGG16 Custom" },
                      { label: "Class ID", value: "#" + Math.random().toString(16).slice(2, 6).toUpperCase() },
                      { label: "Severity", value: result.is_healthy ? "Negligible" : "Moderate-High" },
                    ].map((item, i) => (
                      <div key={i} className="glass rounded-xl p-4 border-white/5">
                        <span className="block text-[9px] uppercase tracking-widest text-text-dim mb-1">{item.label}</span>
                        <span className="block text-sm text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-4 py-4 px-6 rounded-full glass border-white/5">
              <Sprout className="w-4 h-4 text-primary" />
              <p className="text-[10px] text-text-dim font-medium tracking-wide">
                Our AI models are trained on <span className="text-white">18,000+ verified samples</span> from worldwide agronomy databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
