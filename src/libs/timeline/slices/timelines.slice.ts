import { RootState } from '@/libs/create-store.ts';
import { timelinesAdapter } from '@/libs/timeline/models/timeline.entity.ts';
import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { createSlice } from '@reduxjs/toolkit';

export const timelinesSlice = createSlice({
  name: 'timelines',
  initialState: timelinesAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      const timeline = action.payload;
      timelinesAdapter.addOne(state, {
        id: timeline.id,
        user: timeline.user,
        messages: timeline.messages.map((msg) => msg.id),
      });
    });
  },
});

export const selectTimeline = (timelineId: string, state: RootState) =>
  timelinesAdapter.getSelectors().selectById(state.timelines, timelineId);
