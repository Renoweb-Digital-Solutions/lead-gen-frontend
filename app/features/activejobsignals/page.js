"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { activeJobSignalsData } from '@/app/features/featuresData';

export default function ActiveJobSignalsPage() {
    return <FeaturePageTemplate data={activeJobSignalsData} />;
}
