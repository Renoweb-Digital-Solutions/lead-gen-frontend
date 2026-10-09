"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { solutionsData } from '@/app/solutions/solutionsData';

export default function SalesTeamsPage() {
    return <FeaturePageTemplate data={solutionsData['sales-teams']} />;
}
