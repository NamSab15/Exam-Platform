import { Metadata } from 'next';
import CandidatePreviewClient from '@/components/team2/candidate-preview/CandidatePreviewClient';

export const metadata: Metadata = {
  title: 'Candidate Preview - Xebia Exam Platform',
  description: 'Interactive candidate examination simulator to verify question presentation, code editor, and run test options.',
};

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function CandidatePreviewPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return <CandidatePreviewClient questionId={resolvedParams.id || null} />;
}
