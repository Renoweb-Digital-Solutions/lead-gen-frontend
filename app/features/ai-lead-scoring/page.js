"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { aiLeadScoringData } from '@/app/features/featuresData';

export default function AILeadScoringPage() {
    return <FeaturePageTemplate data={aiLeadScoringData} />;
}
