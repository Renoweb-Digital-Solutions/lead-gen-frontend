import React from 'react';
import { motion } from 'framer-motion';
import { CornerMarks, MonoLabel, SectionHeading, AnimatedBorder } from './primitives';
import { SceneRegistry } from './SceneRegistry';
import { Search, Users, Rocket, Target, CheckCircle } from 'lucide-react';

export const BentoGrid = ({ block, accent, index }) => {
  if (block.scene === 'b2b-architecture') {
    return (
      <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
        <div className="max-w-7xl mx-auto p-8 md:p-16">
          <SceneRegistry scene={block.scene} accent={accent} block={block} />
        </div>
      </section>
    );
  }

  if (block.scene) {
    const ICONS = [Search, Users, Rocket, Target, CheckCircle];
    let rowIdx = 0;
    return (
      <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[600px]">
          {/* Left Column */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 border-r border-white/5 relative group flex flex-col justify-center">
            <CornerMarks />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
            >
              {block.tag && <MonoLabel className="mb-4">{block.tag}</MonoLabel>}
              <SectionHeading className="mb-12">{block.title}</SectionHeading>

              <AnimatedBorder accent={accent}>
                <div className="flex flex-col overflow-hidden bg-transparent">
                  {block.paragraphs.map((p, i) => {
                    if (p.startsWith('<strong>')) {
                      // Fix <br/> bug: parse the literal HTML breaks dynamically without touching JSON
                      const textContent = p.replace(/<\/?strong>/g, '');
                      const parts = textContent.split(/<br\s*\/?>/i);
                      const titlePart = parts[0];
                      const descPart = parts.slice(1).join(' ') || (block.paragraphs[i + 1] && !block.paragraphs[i + 1].startsWith('<strong>') ? block.paragraphs[i + 1] : '');
                      
                      const Icon = ICONS[rowIdx % ICONS.length];
                      const numString = `0${rowIdx + 1}`.slice(-2);
                      rowIdx++;

                      return (
                        <div key={i} className="flex gap-4 p-6 border-b border-white/5 last:border-0 bg-[#050507]">
                          <div className="flex flex-col items-center gap-2 mt-1">
                            <MonoLabel className="text-white/20">{numString}</MonoLabel>
                            <Icon className="w-4 h-4 text-white/40" />
                          </div>
                          <div>
                            <h3 className="text-lg font-medium text-white mb-2">{titlePart}</h3>
                            <p className="text-white/60 leading-relaxed text-sm">
                              {descPart}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    
                    if (i > 0 && block.paragraphs[i - 1].startsWith('<strong>')) return null; // skipped because it was folded into the description

                    return (
                      <div key={i} className="p-6 border-b border-white/5 last:border-0 bg-[rgba(5,5,7,0.7)]">
                        <p className="text-white/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: p }} />
                      </div>
                    );
                  })}
                </div>
              </AnimatedBorder>
            </motion.div>
          </div>
          
          {/* Right Column */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 relative flex items-center justify-center min-h-[400px]">
            <SceneRegistry scene={block.scene} accent={accent} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
      <div className="max-w-7xl mx-auto p-8 md:p-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="mb-12 max-w-3xl"
        >
          {block.tag && <MonoLabel className="mb-4">{block.tag}</MonoLabel>}
          <SectionHeading>{block.title}</SectionHeading>
        </motion.div>

        <AnimatedBorder accent={accent}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-transparent">
            {block.paragraphs.map((p, i) => {
            // Check if it's a sub-heading (bold)
            if (p.startsWith('<strong>')) {
              const heading = p.replace(/<\/?strong>/g, '');
              const nextP = block.paragraphs[i + 1] && !block.paragraphs[i + 1].startsWith('<strong>') ? block.paragraphs[i + 1] : '';
              
              if (!nextP) return null; // Let the next iteration handle it if we combine them
              
              return (
                <div key={i} className="bg-[rgba(5,5,7,0.7)] p-8 md:p-10 relative group">
                  <div className="absolute left-0 top-10 bottom-10 w-px bg-white/10 group-hover:bg-[var(--accent)] transition-colors" style={{ '--accent': `var(--${accent}-500, #3b82f6)` }} />
                  <h3 className="text-lg font-medium text-white mb-4 pl-6 relative">
                    <div className="absolute left-[-1.5px] top-2 w-[3px] h-3 bg-white/20 rounded-full" />
                    {heading}
                  </h3>
                  <p className="text-white/60 leading-relaxed pl-6 max-w-[65ch]">
                    {nextP}
                  </p>
                </div>
              );
            }
            // Skip the next paragraph if it was handled by the sub-heading
            if (i > 0 && block.paragraphs[i - 1].startsWith('<strong>')) return null;

            return (
              <div key={i} className={`bg-[rgba(5,5,7,0.7)] p-8 md:p-10 relative group ${i === 0 ? 'md:col-span-2' : ''}`}>
                <p className="text-white/60 leading-relaxed max-w-[65ch]" dangerouslySetInnerHTML={{ __html: p }} />
              </div>
            );
            })}
          </div>
        </AnimatedBorder>
      </div>
    </section>
  );
};
