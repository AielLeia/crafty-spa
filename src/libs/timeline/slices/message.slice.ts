import { RootState } from '@/libs/create-store.ts';
import {
  Message,
  messageAdapter,
} from '@/libs/timeline/models/message.entity.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import {
  postMessage,
  postMessagePending,
} from '@/libs/timeline/usecases/post-message.usecase.ts';
import { createSlice, EntityState, isAnyOf } from '@reduxjs/toolkit';

export type MessageSliceState = EntityState<Message, string> & {
  messagesNotPosted: { [messageId: string]: string };
};

export const messageSlice = createSlice({
  name: 'messages',
  initialState: messageAdapter.getInitialState({
    messagesNotPosted: {},
  }) as MessageSliceState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(postMessagePending, (state, action) => {
      messageAdapter.addOne(state, action.payload);
    });

    builder.addCase(postMessage.rejected, (state, action) => {
      state.messagesNotPosted[action.meta.arg.messageId] =
        action.error.message ?? '';
    });

    builder.addMatcher(
      isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
      (state, action) => {
        messageAdapter.addMany(state, action.payload.messages);
      }
    );
  },
});

export const selectMessage = (id: string, state: RootState) =>
  messageAdapter.getSelectors().selectById(state.timelines.messages, id);

export const selectMessagesOrderedByPublicationDateDesc = (
  ids: string[],
  state: RootState
) => {
  const messages = ids.map((id) => selectMessage(id, state)).filter(Boolean);

  messages.sort(
    (msg1, msg2) =>
      new Date(msg2.publishedAt).getTime() -
      new Date(msg1.publishedAt).getTime()
  );

  return messages;
};
