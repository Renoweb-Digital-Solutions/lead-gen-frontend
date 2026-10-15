import { Target, Map, Activity, Camera, Menu } from "lucide-react";

// To remove a pipeline from the frontend, simply comment it out or remove it from this array.
export const PIPELINES = [
  { id: "leadgen", label: "Lead Gen Pipeline", icon: Target },
  { id: "gmaps", label: "Google Maps", icon: Map },
  { id: "youtube", label: "YouTube Scraper", icon: Activity },
  { id: "instagram", label: "Instagram Scraper", icon: Camera },
  { id: "b2b", label: "B2B Scraper", icon: Menu },
  { id: "investors", label: "Investor Data", icon: Activity },
];
