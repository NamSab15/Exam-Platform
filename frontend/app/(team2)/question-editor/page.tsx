import { Metadata } from 'next';
import QuestionEditorClient from '@/components/team2/question-editor/QuestionEditorClient';

export const metadata: Metadata = {
  title: 'Question Editor - Xebia Exam Platform',
  description: 'Create and configure exam questions, test cases, starter code, tags, and cognitive grading rules.',
};

interface PageProps {
  searchParams: Promise<{ id?: string; new?: string }>;
}

export default async function QuestionEditorPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  return (
    <QuestionEditorClient
      questionId={resolvedParams.id || null}
      isNew={resolvedParams.new === 'true'}
    />
  );
}
