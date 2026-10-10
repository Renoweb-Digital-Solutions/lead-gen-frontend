import React from 'react';
import dynamic from 'next/dynamic';
import { GenericScene } from './scenes/GenericScene';

const YoutubeSignal = dynamic(() => import('./scenes/YoutubeSignal').then(mod => mod.YoutubeSignal), { ssr: false, loading: () => <GenericScene accent="red" /> });
const InvestorOrbit = dynamic(() => import('./scenes/InvestorOrbit').then(mod => mod.InvestorOrbit), { ssr: false, loading: () => <GenericScene accent="green" /> });
const ComparisonTrack = dynamic(() => import('./scenes/ComparisonTrack').then(mod => mod.ComparisonTrack), { ssr: false, loading: () => <GenericScene accent="blue" /> });
const InstagramDiscoveryScene = dynamic(() => import('./scenes/InstagramDiscoveryScene').then(mod => mod.InstagramDiscoveryScene), { ssr: false, loading: () => <GenericScene accent="pink" /> });
const InstagramVsPeopleScene = dynamic(() => import('./scenes/InstagramVsPeopleScene').then(mod => mod.InstagramVsPeopleScene), { ssr: false, loading: () => <GenericScene accent="pink" /> });
const InvestorRadarScene = dynamic(() => import('./scenes/InvestorRadarScene').then(mod => mod.InvestorRadarScene), { ssr: false, loading: () => <GenericScene accent="orange" /> });
const DirectoryArchitectureScene = dynamic(() => import('./scenes/b2b/DirectoryArchitectureScene').then(mod => mod.DirectoryArchitectureScene), { ssr: false, loading: () => <GenericScene accent="yellow" /> });
const DirectorySearchScene = dynamic(() => import('./scenes/b2b/DirectorySearchScene').then(mod => mod.DirectorySearchScene), { ssr: false, loading: () => <GenericScene accent="yellow" /> });
const YoutubeComparisonScene = dynamic(() => import('./scenes/shared/YoutubeComparisonScene').then(mod => mod.YoutubeComparisonScene), { ssr: false, loading: () => <GenericScene accent="red" /> });

export function SceneRegistry({ scene, accent, block }) {
  switch (scene) {
    case 'youtube-signal':
      return <YoutubeSignal accent={accent} />;
    case 'investor-orbit':
      return <InvestorOrbit accent={accent} />;
    case 'youtube-comparison':
      return <YoutubeComparisonScene />;
    case 'comparison-track':
      return <ComparisonTrack accent={accent} />;
    case 'instagram-discovery':
      return <InstagramDiscoveryScene accent={accent} />;
    case 'instagram-comparison':
      return <InstagramVsPeopleScene />;
    case 'investor-radar':
      return <InvestorRadarScene />;
    case 'b2b-architecture':
      return <DirectoryArchitectureScene accent={accent} block={block} />;
    case 'b2b-directory-search':
      return <DirectorySearchScene />;
    default:
      return <GenericScene accent={accent} />;
  }
}
