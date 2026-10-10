import React from 'react';
import { motion } from 'framer-motion';
import { MonoLabel, AnimatedBorder } from './primitives';

export const SignalCallout = ({ block, accent, index }) => {
  return (
    <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="max-w-4xl mx-auto p-8 md:p-24 relative z-10 text-center">
        {block.tag && <MonoLabel className="mb-6 justify-center">{block.tag}</MonoLabel>}
        
        <div className="space-y-8">
          {block.paragraphs.map((p, i) => {
            const isSignal = p.includes('≠');
            
            if (isSignal) {
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="my-12 inline-block mx-auto"
                >
                  <AnimatedBorder accent={accent} className="py-8 px-6 bg-[#0a0a0c]">
                    <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
                      <div className="absolute top-0 bottom-0 w-1 bg-white/20 blur-[2px] animate-[sweep_4s_ease-in-out_infinite]" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-mono tracking-tight text-white m-0 relative z-10">
                      {p}
                    </h3>
                  </AnimatedBorder>
                </motion.div>
              );
            }
            
            return (
              <p 
                key={i} 
                className="text-white/60 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: p.replace(/\\n/g, '<br/>') }}
              />
            );
          })}
        </div>
      </div>
      <style>{`
        @keyframes sweep {
          0% { transform: translateX(-100px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(800px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};
