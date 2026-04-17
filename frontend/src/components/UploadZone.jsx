import { useState, useRef, useCallback } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadZone({ onFile, imageUrl, onReset }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    setIsDragging(e.type === 'dragover');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onFile(file);
  }, [onFile]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {!imageUrl ? (
          <motion.div
            key="upload-zone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`cursor-pointer group relative overflow-hidden rounded-[2rem] border-2 border-dashed transition-all duration-500 p-12 text-center
              ${isDragging 
                ? 'border-primary bg-primary/5 shadow-[0_0_50px_rgba(34,197,94,0.1)]' 
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]'
              }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
              accept="image/*"
            />
            
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500">
                <Upload className={`w-8 h-8 transition-colors duration-500 ${isDragging ? 'text-primary' : 'text-text-dim'}`} />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-text-main serif">Diagnostic Scan</h3>
                <p className="text-sm text-text-dim max-w-[240px] mx-auto">
                  Drag and drop a tomato leaf image or <span className="text-primary font-medium">browse files</span>
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-4">
                <span className="px-3 py-1 glass-pill rounded-full text-[10px] uppercase tracking-widest text-text-dim">JPG</span>
                <span className="px-3 py-1 glass-pill rounded-full text-[10px] uppercase tracking-widest text-text-dim">PNG</span>
                <span className="px-3 py-1 glass-pill rounded-full text-[10px] uppercase tracking-widest text-text-dim">WEBP</span>
              </div>
            </div>

            {/* Background elements */}
            <div className={`absolute inset-0 opacity-20 transition-opacity duration-1000 ${isDragging ? 'opacity-40' : 'group-hover:opacity-30'}`}>
              <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl m-6" />
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-primary/30 rounded-tr-3xl m-6" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-primary/30 rounded-bl-3xl m-6" />
              <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/30 rounded-br-3xl m-6" />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative group rounded-[2rem] overflow-hidden glass p-3 border-white/10 shadow-2xl"
          >
            <div className="relative aspect-video rounded-[1.5rem] overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Leaf Preview" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-main/80 via-transparent to-transparent" />
              
              <div className="absolute top-4 left-4">
                <div className="glass-pill px-3 py-1.5 rounded-full flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">Image Captured</span>
                </div>
              </div>

              <button 
                onClick={onReset}
                className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md border border-red-500/30"
              >
                Remove
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
