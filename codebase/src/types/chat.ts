export type Confidence = { level: 'high' | 'medium' | 'low'; label: string };
export type Source = {
  id: string;
  title: string;
  source: string;
  url: string | null;
  section: string | null;
  page: number | null;
  verified: boolean;
};
export type ChatResponse = {
  answer: string;
  confidence: Confidence;
  sources: Source[];
  locationId: string | null;
  mode: 'live' | 'retrieval-fallback' | 'offline-demo' | 'extractive';
};
