import { RootState } from '@/libs/create-store.ts';
import { messageAdapter } from '@/libs/timeline/models/message.entity.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { createSlice } from '@reduxjs/toolkit';

export const messageSlice = createSlice({
  name: 'messages',
  initialState: messageAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      messageAdapter.addMany(state, action.payload.messages);
    });
  },
});

export const selectMessage = (id: string, state: RootState) =>
  messageAdapter.getSelectors().selectById(state.timelines.messages, id);

export const selectMessages = (ids: string[], state: RootState) =>
  ids.map((id) => selectMessage(id, state)).filter(Boolean);
