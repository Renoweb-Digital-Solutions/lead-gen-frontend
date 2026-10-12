import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CornerMarks, MonoLabel, SectionHeading, AnimatedBorder } from './primitives';
import { SceneRegistry } from './SceneRegistry';

export const ComparisonSlider = ({ block, accent, index }) => {
  const [activeColumn, setActiveColumn] = useState('both'); // 'both', 'left', 'right'
  
  if (!block.table) return null;
  
  const [leftHeader, rightHeader] = block.table.headers;

  return (
    <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
      <div className="max-w-6xl mx-auto p-8 md:p-16">
        <div className="flex flex-col md:flex-row gap-12 mb-16 items-center">
          <div className="w-full md:w-1/2">
            {block.tag && <MonoLabel className="mb-4">{block.tag}</MonoLabel>}
            <SectionHeading>{block.title}</SectionHeading>
            <div className="mt-6 text-white/60 leading-relaxed">
              {block.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex items-center justify-center min-h-[200px]">
             {block.scene && <SceneRegistry scene={block.scene} accent={accent} />}
          </div>
        </div>

        {/* Segmented Control */}
        <div 
          className="flex p-1 bg-white/5 border border-white/10 rounded-lg w-fit mx-auto mb-12"
          role="tablist"
        >
          {['both', 'left', 'right'].map((opt) => (
            <button
              key={opt}
              role="tab"
              aria-selected={activeColumn === opt}
              onClick={() => setActiveColumn(opt)}
              className={`px-6 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                activeColumn === opt ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'
              }`}
            >
              {opt === 'left' ? leftHeader : opt === 'right' ? rightHeader : 'Both'}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto scroll-styled">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th scope="col" className={`w-1/2 p-6 border-b border-white/10 transition-opacity duration-300 ${activeColumn === 'right' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="text-xl font-semibold text-white">{leftHeader}</div>
                </th>
                <th scope="col" className={`w-1/2 p-6 border-b border-white/10 transition-opacity duration-300 ${activeColumn === 'left' ? 'opacity-30' : 'opacity-100'}`}>
                  <div className="text-xl font-semibold text-white">{rightHeader}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group relative"
                >
                  <td className={`p-6 border-b border-white/5 transition-opacity duration-300 ${activeColumn === 'right' ? 'opacity-30' : 'opacity-100'}`}>
                    <span className="text-white/70 group-hover:text-white group-hover:underline decoration-white/20 underline-offset-4 transition-colors">
                      {row[0]}
                    </span>
                  </td>
                  <td className={`p-6 border-b border-white/5 transition-opacity duration-300 ${activeColumn === 'left' ? 'opacity-30' : 'opacity-100'}`}>
                    <span className="text-white/70 group-hover:text-white group-hover:underline decoration-white/20 underline-offset-4 transition-colors relative">
                      {row[1]}
                      {/* Decorative connection line on hover */}
                      <div className="absolute -left-12 top-1/2 w-8 h-px bg-white/20 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {block.afterTable && (
          <AnimatedBorder accent={accent} containerClassName="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-transparent">
              {block.afterTable.map((p, i) => (
                <div key={i} className="bg-[rgba(5,5,7,0.7)] p-8 relative flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0 mt-1">
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                 </div>
                 <p className="text-white/70 leading-relaxed text-lg" dangerouslySetInnerHTML={{ __html: p }} />
              </div>
              ))}
            </div>
          </AnimatedBorder>
        )}
      </div>
    </section>
  );
};
