import FeedbackError from '@/components/ui/FeedbackError';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Turismomza | Error',
  description: '...',
};

export default function ErrorPage() {
  return (
    <div className="flex flex-grow p-8 md:p-12 h-full justify-center items-center">
      <FeedbackError />
    </div>
  );
}
