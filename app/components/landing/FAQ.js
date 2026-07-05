"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "How fresh is your data?",
    a: "Unlike traditional databases that update monthly, our system pings emails and cross-references job postings in real-time. The data you see is validated at the moment of your search."
  },
  {
    q: "Can I export my lead lists?",
    a: "Yes. All plans allow you to easily export your filtered leads and AI scores as CSV files, ready to be uploaded into any outreach tool."
  },
  {
    q: "How does the AI lead scoring work?",
    a: "Our proprietary model analyzes over 40 data points including recent funding, hiring velocity in specific departments, and social signals to predict which companies have active buying intent for your offering."
  },
  {
    q: "What is your coverage outside the US?",
    a: "Excellent. We aggregate from global public sources and have robust coverage across EMEA and APAC, specifically in tech, finance, and manufacturing sectors."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-24 bg-[#f7f9ff]">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4">
            Common Questions
          </h2>
          <p className="text-slate-500 text-lg">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <div className="p-6 flex items-center justify-between gap-4">
                <h3 className="font-bold text-brand-dark text-lg">{faq.q}</h3>
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openIndex === i ? 'bg-brand-blue/10 text-brand-blue' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}
                >
                  <motion.div
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <Plus className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
              
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                  >
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
