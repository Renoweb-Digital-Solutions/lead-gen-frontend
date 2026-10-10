import React from 'react';
import { motion } from 'framer-motion';
import { CornerMarks, MonoLabel, SectionHeading, AnimatedBorder } from './primitives';
import { SceneRegistry } from './SceneRegistry';

export const HeroSplit = ({ block, accent, index }) => {
  return (
    <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[600px]">
        
        {/* Left Column - Copy */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 border-r border-white/5 relative group flex flex-col justify-center">
          <CornerMarks />
          {block.tag && <MonoLabel className="mb-6">{block.tag}</MonoLabel>}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <SectionHeading className="mb-8">{block.title}</SectionHeading>
            
            <div className="space-y-6">
              {block.paragraphs.map((p, i) => {
                // If the paragraph starts with a bullet, restyle it
                if (p.startsWith('•')) {
                  const items = p.split('\n').filter(Boolean);
                  return (
                    <AnimatedBorder key={i} accent={accent} containerClassName="mt-8">
                      <ul className="flex flex-col overflow-hidden bg-[rgba(5,5,7,0.7)]">
                        {items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 bg-white/[0.02]">
                            <MonoLabel className="text-white/20">0{idx + 1}</MonoLabel>
                            <span className="text-white/80">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </AnimatedBorder>
                  );
                }
                
                return (
                  <p 
                    key={i} 
                    className={`text-white/60 leading-relaxed ${i === 0 ? 'text-lg md:text-xl' : 'text-base'}`}
                    dangerouslySetInnerHTML={{ __html: p.replace(/\\n/g, '<br/>') }}
                  />
                );
              })}
            </div>
          </motion.div>
        </div>
        
        {/* Right Column - Scene */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 relative flex items-center justify-center min-h-[400px]">
          <SceneRegistry scene={block.scene} accent={accent} />
        </div>
        
      </div>
    </section>
  );
};
