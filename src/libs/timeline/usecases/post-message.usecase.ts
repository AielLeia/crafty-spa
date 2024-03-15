import { selectAuthUserId } from '@/libs/auth/reducer.ts';
import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';
import { Message } from '@/libs/timeline/models/message.entity.ts';
import { createAction } from '@reduxjs/toolkit';

export type PostMessageParams = {
  messageId: string;
  timelineId: string;
  text: string;
};

export const postMessagePending = createAction<Message>(
  'timelines/postMessagePending'
);

export const postMessage = createAppAsyncThunk(
  'timelines/postMessage',
  (
    params: PostMessageParams,
    { extra: { dateProvider, messageGateway }, dispatch, getState }
  ) => {
    const authUser = selectAuthUserId(getState());
    const message: Message = {
      id: params.messageId,
      author: authUser,
      text: params.text,
      publishedAt: dateProvider.getNow().toISOString(),
    };

    dispatch(postMessagePending(message));

    return messageGateway.postMessage({
      id: message.id,
      timelineId: params.timelineId,
      text: message.text,
      author: message.author,
      publishedAt: message.publishedAt,
    });
  }
);
