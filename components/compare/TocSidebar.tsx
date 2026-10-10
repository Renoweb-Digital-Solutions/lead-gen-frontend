"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TocItem {
  title: string;
  id: string;
}

export default function TocSidebar({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">On this page</h4>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block text-sm transition-colors",
                activeId === item.id
                  ? "text-blue-600 font-medium"
                  : "text-slate-500 hover:text-slate-900"
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}