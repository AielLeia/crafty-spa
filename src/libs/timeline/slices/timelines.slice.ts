import { RootState } from '@/libs/create-store.ts';
import {
  Timeline,
  timelinesAdapter,
} from '@/libs/timeline/models/timeline.entity.ts';
import {
  getAuthUserTimeline,
  getAuthuserTimelinePending,
} from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { createSlice, EntityState } from '@reduxjs/toolkit';

export type TimelinesSliceState = EntityState<Timeline, string> & {
  loadingTimelinesByUser: { [userId: string]: boolean };
};

export const timelinesSlice = createSlice({
  name: 'timelines',
  initialState: timelinesAdapter.getInitialState({
    loadingTimelinesByUser: {},
  }) as TimelinesSliceState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthuserTimelinePending, (state, action) => {
      state.loadingTimelinesByUser[action.payload.userAuth] = true;
    });
    builder.addCase(getAuthUserTimeline.fulfilled, (state, action) => {
      const timeline = action.payload;
      timelinesAdapter.addOne(state, {
        id: timeline.id,
        user: timeline.user,
        messages: timeline.messages.map((msg) => msg.id),
      });
      state.loadingTimelinesByUser[timeline.user] = false;
    });
  },
});

export const selectTimeline = (timelineId: string, state: RootState) =>
  timelinesAdapter
    .getSelectors()
    .selectById(state.timelines.timelines, timelineId);

export const selectIsUserTimelineLoading = (user: string, state: RootState) => {
  return state.timelines.timelines.loadingTimelinesByUser[user] ?? false;
};

export const selectTimelineForUser = (user: string, state: RootState) => {
  return timelinesAdapter
    .getSelectors()
    .selectAll(state.timelines.timelines)
    .filter((t) => t.user === user)[0];
};
