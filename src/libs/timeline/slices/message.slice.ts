import { RootState } from '@/libs/create-store.ts';
import { messageAdapter } from '@/libs/timeline/models/message.entity.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'messages',
  initialState: messageAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
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

export const selectMessages = (ids: string[], state: RootState) =>
  ids.map((id) => selectMessage(id, state)).filter(Boolean);
