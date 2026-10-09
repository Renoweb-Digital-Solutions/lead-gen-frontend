"use client";

import React from 'react';
import FeaturePageTemplate from '@/app/components/ui/FeaturePageTemplate';
import { googleMapsSearchData } from '@/app/features/featuresData';

export default function GoogleMapsSearchPage() {
    return <FeaturePageTemplate data={googleMapsSearchData} />;
}
