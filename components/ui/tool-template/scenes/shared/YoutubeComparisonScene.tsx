"use client";

import React from 'react';
import { TwoLanesScene, LaneConfig } from './TwoLanesScene';

const youtubeLane1: LaneConfig = {
  id: 'yt-lane',
  label: 'KEYWORD → CHANNELS',
  shortLabel: 'KEYWORD',
  tone: 'red',
  shape: 'organic',
  startNode: {
    type: 'search',
    chips: ['KEYWORD']
  },
  items: [
    { id: '1', type: 'channel', label: 'saas_growth', sub: '12K', hasMail: true },
    { id: '2', type: 'channel', label: 'b2b_sales', sub: '45K' },
    { id: '3', type: 'channel', label: 'tech_founder', sub: '8K', hasMail: true },
    { id: '4', type: 'channel', label: 'marketing_pro', sub: '22K' },
  ],
  packetDur: 5,
};

const youtubeLane2: LaneConfig = {
  id: 'people-lane',
  label: 'ROLE → CONTACTS',
  shortLabel: 'ROLE',
  tone: 'slate',
  shape: 'orthogonal',
  startNode: {
    type: 'briefcase',
    chips: ['TITLE', 'SENIORITY', 'FUNCTION']
  },
  items: [
    { id: '1', type: 'square', label: 'VPs', iconName: 'Users' },
    { id: '2', type: 'square', label: 'SaaS', iconName: 'Building2' },
    { id: '3', type: 'square', label: 'USA', iconName: 'MapPin' },
  ],
  packetDur: 7,
};

export const YoutubeComparisonScene = () => {
  return (
    <TwoLanesScene 
      lane1={youtubeLane1} 
      lane2={youtubeLane2} 
      mergeLabel="PROSPECT LIST" 
    />
  );
};
