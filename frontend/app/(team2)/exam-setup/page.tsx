import { Metadata } from 'next';
import ExamSetupClient from '@/components/team2/exam-setup/ExamSetupClient';

export const metadata: Metadata = {
  title: 'Exam Configuration Setup - Xebia Exam Platform',
  description: 'Configure and parameterize examination structures and proctoring locks.',
};

export default function ExamSetupPage() {
  return <ExamSetupClient />;
}
