import React from 'react';
import { motion } from 'framer-motion';
import { MonoLabel, SectionHeading } from './primitives';

export const BentoPanel = ({ block, accent, index }) => {
  return (
    <section className="relative w-full border-t border-white/5 bg-[rgba(5,5,7,0.7)]">
      <div className="max-w-4xl mx-auto p-8 md:p-16">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
        >
          {block.tag && <MonoLabel className="mb-4">{block.tag}</MonoLabel>}
          <SectionHeading className="mb-8">{block.title}</SectionHeading>
          
          <div className="space-y-6 text-white/60 leading-relaxed">
            {block.paragraphs.map((p, i) => (
              <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\\n/g, '<br/>') }} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
