"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { solutionsData } from '@/app/solutions/solutionsData';

export default function AgenciesPage() {
    return <FeaturePageTemplate data={solutionsData['agencies']} />;
}
