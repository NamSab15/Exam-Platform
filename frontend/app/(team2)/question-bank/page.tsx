import { Metadata } from 'next';
import QuestionBankClient from '@/components/team2/question-bank/QuestionBankClient';

export const metadata: Metadata = {
  title: 'Question Bank - Xebia Exam Platform',
  description: 'Manage active and draft questions, tags, types, cognitive levels, and evaluation rules for exam structures.',
};

export default function QuestionBankPage() {
  return <QuestionBankClient />;
}
