import React from 'react';
import { HeroSplit } from './HeroSplit';
import { BentoGrid } from './BentoGrid';
import { ComparisonSlider } from './ComparisonSlider';
import { SignalCallout } from './SignalCallout';
import { BentoPanel } from './BentoPanel';

export function SectionRenderer({ block, accent, index }) {
  switch (block.layout) {
    case 'HeroSplit':
      return <HeroSplit block={block} accent={accent} index={index} />;
    case 'BentoGrid':
      return <BentoGrid block={block} accent={accent} index={index} />;
    case 'ComparisonSlider':
      return <ComparisonSlider block={block} accent={accent} index={index} />;
    case 'SignalCallout':
      return <SignalCallout block={block} accent={accent} index={index} />;
    default:
      return <BentoPanel block={block} accent={accent} index={index} />;
  }
}
