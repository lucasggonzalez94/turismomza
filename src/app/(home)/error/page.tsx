import FeedbackError from '@/components/ui/FeedbackError';

export default function ErrorPage() {
  return (
    <div className="flex flex-grow p-8 md:p-12 h-full justify-center items-center">
      <FeedbackError />
    </div>
  );
}
