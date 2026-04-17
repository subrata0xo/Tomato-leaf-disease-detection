import { motion } from 'framer-motion';

export default function Background() {
  return (
    <div className="bg-mesh">
      {/* Primary blobs */}
      <div 
        className="mesh-blob top-[-10%] left-[-10%] bg-primary" 
        style={{ animationDelay: '0s' }} 
      />
      <div 
        className="mesh-blob bottom-[-10%] right-[-10%] bg-accent" 
        style={{ animationDelay: '-5s' }} 
      />
      
      {/* Dynamic secondary blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[30%] left-[40%] w-[500px] h-[500px] bg-blue-500 rounded-full filter blur-[100px]"
      />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
