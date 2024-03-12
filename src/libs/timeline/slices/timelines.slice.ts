import { RootState } from '@/libs/create-store.ts';
import {
  Timeline,
  timelinesAdapter,
} from '@/libs/timeline/models/timeline.entity.ts';
import {
  getAuthUserTimeline,
  getAuthuserTimelinePending,
} from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { getUserTimeline } from '@/libs/timeline/usecases/get-user-timeline.usecase.ts';
import { postMessage } from '@/libs/timeline/usecases/post-message.usecase.ts';
import { createSlice, EntityState, isAnyOf } from '@reduxjs/toolkit';

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
      setUserTimelineLoadingState(state, {
        userId: action.payload.userAuth,
        loading: true,
      });
    });

    builder.addCase(getUserTimeline.pending, (state, action) => {
      setUserTimelineLoadingState(state, {
        userId: action.meta.arg.userId,
        loading: true,
      });
    });

    builder.addCase(postMessage.pending, (state, action) => {
      const timeline = timelinesAdapter
        .getSelectors()
        .selectById(state, action.meta.arg.timelineId);
      timelinesAdapter.updateOne(state, {
        id: timeline.id,
        changes: {
          messages: [
            ...timeline.messages,
            timeline.messages.includes(action.meta.arg.messageId)
              ? undefined
              : action.meta.arg.messageId,
          ].filter(Boolean),
        },
      });
    });

    builder.addMatcher(
      isAnyOf(getAuthUserTimeline.fulfilled, getUserTimeline.fulfilled),
      (state, action) => {
        const timeline = action.payload;
        timelinesAdapter.addOne(state, {
          id: timeline.id,
          user: timeline.user.id,
          messages: timeline.messages.map((msg) => msg.id),
        });
        setUserTimelineLoadingState(state, {
          userId: timeline.user.id,
          loading: false,
        });
      }
    );
  },
});

const setUserTimelineLoadingState = (
  state: TimelinesSliceState,
  { userId, loading }: { userId: string; loading: boolean }
) => {
  state.loadingTimelinesByUser[userId] = loading;
};

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
