"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { companyIntelligenceData } from '@/app/features/featuresData';

export default function CompanyIntelligencePage() {
    return <FeaturePageTemplate data={companyIntelligenceData} />;
}
