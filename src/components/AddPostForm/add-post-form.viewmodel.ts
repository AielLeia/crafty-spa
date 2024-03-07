import { AppDispatch } from '@/libs/create-store.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';

export const createAddPostFormViewModel = ({
  dispatch,
  messageId,
  timelineId,
  charactersCount,
  maxCharacters,
  setCharactersCount,
}: {
  dispatch: AppDispatch;
  messageId: string;
  timelineId: string;
  maxCharacters: number;
  charactersCount: number;
  setCharactersCount: (newCharactersCount: number) => void;
}) => {
  const hasReachedMaxCount = charactersCount > maxCharacters;
  const canSubmit = charactersCount !== 0 && !hasReachedMaxCount;

  const color = hasReachedMaxCount ? 'red.300' : 'muted';
  const inputBackgroundColor = color;
  const charCounterColor = color;

  return {
    canSubmit,

    inputBackgroundColor,

    charCounterColor,

    remaining: maxCharacters - charactersCount,

    postMessage(text: string) {
      dispatch(
        postMessage({
          messageId,
          timelineId,
          text: text.trim(),
        })
      );

      setCharactersCount(0);
    },

    handleTextChange(newText: string) {
      setCharactersCount(newText.trim().length);
    },
  };
};
