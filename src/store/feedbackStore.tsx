import { create } from 'zustand';
import { ErrorFeedback } from '@/interfaces/errorFeedback';

interface State {
  errorFeedback: ErrorFeedback | null;
  setErrorFeedback: (error: ErrorFeedback) => void;
}

export const useFeedbackStore = create<State>((set) => ({
  errorFeedback: null,
  setErrorFeedback: (errorFeedback) => set(() => ({ errorFeedback })),
}));
