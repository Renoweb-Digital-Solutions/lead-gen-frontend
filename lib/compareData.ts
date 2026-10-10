import fs from 'fs';
import path from 'path';

export interface ComparisonMeta {
  title: string;
  description: string;
}

export interface ComparisonHub {
  competitor: string;
  description: string;
}

export interface ComparisonSection {
  type: 'hero' | 'summary' | 'comparisonTable' | 'featureGrid' | 'prosCons' | 'pricingTable' | 'useCases' | 'textBlock' | 'list' | 'faq' | 'cta' | 'disclaimer';
  data: any;
}

export interface ComparisonData {
  slug: string;
  meta: ComparisonMeta;
  hub: ComparisonHub;
  sections: ComparisonSection[];
}

const dataDir = path.join(process.cwd(), 'data', 'comparisons');

export async function getComparisonSlugs(): Promise<string[]> {
  if (!fs.existsSync(dataDir)) return [];
  const files = fs.readdirSync(dataDir);
  return files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''));
}

export async function getComparisonData(slug: string): Promise<ComparisonData | null> {
  const filePath = path.join(dataDir, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content) as ComparisonData;
}

export async function getAllComparisons(): Promise<ComparisonData[]> {
  const slugs = await getComparisonSlugs();
  const comps = await Promise.all(slugs.map(getComparisonData));
  return comps.filter(Boolean) as ComparisonData[];
}
