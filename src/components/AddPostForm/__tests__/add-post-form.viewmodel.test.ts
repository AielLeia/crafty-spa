import { AppDispatch, createTestStore } from '@/libs/create-store.ts';
import { postMessage as postMessageUseCase } from '@/libs/timeline/usecases/post-message.usecase.ts';
import { describe, expect, test, vi } from 'vitest';

import { createAddPostFormViewModel } from '@/components/AddPostForm/add-post-form.viewmodel.ts';

const createTestAddPostFormViewModel = ({
  dispatch = vi.fn(),
  messageId = 'test',
  timelineId = 'test',
  maxCharacters = Infinity,
  charactersCount = 42,
  setCharactersCounts = () => {},
}: {
  dispatch?: AppDispatch;
  messageId?: string;
  timelineId?: string;
  maxCharacters?: number;
  charactersCount?: number;
  setCharactersCounts?: (newCharactersCount: number) => void;
} = {}) => {
  return createAddPostFormViewModel({
    dispatch,
    messageId,
    timelineId,
    maxCharacters,
    charactersCount,
    setCharactersCount: setCharactersCounts,
  });
};

describe('Add post form view models', () => {
  test('postMessage correctly dispatch the postMessage use case', () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      dispatch: store.dispatch,
      messageId: 'message-id',
      timelineId: 'asma-timeline-id',
    });

    postMessage('Hello world');

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: 'message-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello world',
    });
  });

  test('Character count is reset when posting a message', () => {
    let charactersCount = 42;
    const { postMessage } = createTestAddPostFormViewModel({
      setCharactersCounts: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    postMessage('Hello la mifa');

    expect(charactersCount).toEqual(0);
  });

  test('postMessage correctly dispatch the postMessage use case with trimmed message text', () => {
    const store = createTestStore();
    const { postMessage } = createTestAddPostFormViewModel({
      dispatch: store.dispatch,
      messageId: 'message-id',
      timelineId: 'asma-timeline-id',
    });

    postMessage(
      '                                                    Hello world                                        '
    );

    expect(store.getDispatchedUseCaseArgs(postMessageUseCase)).toEqual({
      messageId: 'message-id',
      timelineId: 'asma-timeline-id',
      text: 'Hello world',
    });
  });

  test('Cannot post a message if text is empty', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      charactersCount: 0,
    });

    expect(canSubmit).toBe(false);
  });

  test('Can post a message if text is not empty', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      charactersCount: 1,
    });

    expect(canSubmit).toBe(true);
  });

  test('Can post a message if text size is inferior to max characters allowed', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 99,
    });

    expect(canSubmit).toBe(true);
  });

  test('Can post a message if text size is equal to max characters allowed', () => {
    const { canSubmit } = createTestAddPostFormViewModel({
      maxCharacters: 100,
      charactersCount: 100,
    });

    expect(canSubmit).toBe(true);
  });

  test('returns the remaining characters', () => {
    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 10,
        charactersCount: 0,
      }).remaining
    ).toEqual(10);
    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 10,
        charactersCount: 1,
      }).remaining
    ).toEqual(9);
    expect(
      createTestAddPostFormViewModel({
        maxCharacters: 20,
        charactersCount: 30,
      }).remaining
    ).toEqual(-10);
  });

  test('can handle new text size on input changed', () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCounts: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    handleTextChange('Hello world');

    expect(charactersCount).toEqual(11);
  });

  test('Leading and trailing spaces should not be count as characters', () => {
    let charactersCount = 0;
    const { handleTextChange } = createTestAddPostFormViewModel({
      setCharactersCounts: (newCharactersCount) => {
        charactersCount = newCharactersCount;
      },
    });

    handleTextChange(
      '                       Hello world                               '
    );

    expect(charactersCount).toEqual(11);
  });

  test('Should notify visually about maximum characters being reached if current count is over max count', () => {
    const { charCounterColor, inputBackgroundColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 99,
        charactersCount: 100,
      });

    expect(inputBackgroundColor).toBe('red.300');
    expect(charCounterColor).toBe('red.300');
  });

  test('Should not notify visually about maximum characters being reached if current count is inferior to max count', () => {
    const { inputBackgroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 99,
      });

    expect(inputBackgroundColor).toBe('muted');
    expect(charCounterColor).toBe('muted');
  });

  test('Should not notify visually about maximum characters being reached if current count is equal to max count', () => {
    const { inputBackgroundColor, charCounterColor } =
      createTestAddPostFormViewModel({
        maxCharacters: 100,
        charactersCount: 100,
      });

    expect(inputBackgroundColor).toBe('muted');
    expect(charCounterColor).toBe('muted');
  });
});
