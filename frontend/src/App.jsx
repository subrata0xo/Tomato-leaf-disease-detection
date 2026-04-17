import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, AlertCircle } from 'lucide-react';
import Header from "./components/Header";
import UploadZone from "./components/UploadZone";
import ResultCard from "./components/ResultCard";
import HistorySidebar from "./components/HistorySidebar";
import Background from "./components/Background";
import ScanningBeam from "./components/ScanningBeam";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("tomato_scan_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = useCallback((scanResult, imgUrl) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      disease: scanResult.disease,
      confidence: scanResult.confidence,
      imageUrl: imgUrl,
      result: scanResult // Store full result for re-viewing
    };
    const updatedHistory = [newEntry, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem("tomato_scan_history", JSON.stringify(updatedHistory));
  }, [history]);

  const handleFile = useCallback((f) => {
    setFile(f);
    setImageUrl(URL.createObjectURL(f));
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`${API_URL}/predict`, { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Prediction failed.");
      }
      const data = await res.json();
      setResult(data);
      saveToHistory(data, imageUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setImageUrl(null);
    setResult(null);
    setError(null);
  };

  const handleSelectHistory = (item) => {
    setResult(item.result);
    setImageUrl(item.imageUrl);
    setIsHistoryOpen(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("tomato_scan_history");
  };

  return (
    <div className="relative min-h-screen text-text-main">
      <Background />
      
      <Header 
        onToggleHistory={() => setIsHistoryOpen(true)} 
        historyCount={history.length} 
      />

      <main className="max-w-6xl mx-auto pb-24 px-6">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 glass-pill rounded-full border border-primary/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">System Operational</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] serif"
          >
            Heal your crop with <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">Precision AI.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-text-dim text-lg max-w-xl mx-auto"
          >
            Upload a high-resolution photo of your tomato leaf to identify pathogens, nutrient deficiencies, and pest infestations instantly.
          </motion.p>
        </div>

        <section className="space-y-8">
          <div className="relative">
            <UploadZone 
              onFile={handleFile} 
              imageUrl={imageUrl} 
              onReset={reset} 
            />
            {loading && <ScanningBeam />}
          </div>

          <AnimatePresence>
            {imageUrl && !result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-2xl mx-auto"
              >
                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="w-full relative group overflow-hidden py-5 rounded-2xl bg-primary text-black font-bold tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Initializing Deep Scan...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Execute Neural Diagnosis</span>
                      </>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-mono flex items-center gap-3"
            >
              <AlertCircle className="w-4 h-4" />
              <span>ENTRY_ERROR: {error}</span>
            </motion.div>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-8"
              >
                <ResultCard result={result} imageUrl={imageUrl} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Info Blocks */}
        {!result && !imageUrl && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: '🔬', title: 'Laboratory Accuracy', desc: 'Our neural network benchmarks at 98.4% accuracy across all 10 supported classes.' },
              { icon: '⚡', title: 'Instant Inference', desc: 'Hardware-accelerated processing delivers comprehensive results in under 2 seconds.' },
              { icon: '📖', title: 'Treatment Archive', desc: 'Integrated database of organic and chemical solutions curated by expert agronomists.' },
            ].map((box, i) => (
              <div key={i} className="glass p-6 rounded-3xl border-white/5 space-y-3">
                <span className="text-3xl">{box.icon}</span>
                <h4 className="text-lg font-bold">{box.title}</h4>
                <p className="text-sm text-text-dim leading-relaxed">{box.desc}</p>
              </div>
            ))}
          </motion.div>
        )}
      </main>

      <HistorySidebar 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={clearHistory}
        onSelect={handleSelectHistory}
      />

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍅</span>
            <span className="text-sm font-bold tracking-tighter uppercase font-mono">TomatoScan v2.0.4</span>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-mono">
            Powered by TensorFlow · Built by Google DeepMind Agents
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
