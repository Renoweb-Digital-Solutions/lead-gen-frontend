import { toolsData } from '../toolsData';
import ToolTemplate from '@/components/ui/ToolTemplate';

export function generateMetadata() {
  const data = toolsData['investor-data'];
  return {
    title: data.metaTitle,
    description: data.metaDescription,
  };
}

export default function Page() {
  const data = toolsData['investor-data'];
  return <ToolTemplate data={data} />;
}
