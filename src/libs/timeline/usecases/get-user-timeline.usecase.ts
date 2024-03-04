import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const getUserTimeline = createAppAsyncThunk(
  'timelines/getUserTimeline',
  async (params: { userId: string }, { extra: { timelineGateway } }) => {
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: params.userId,
    });
    return timeline;
  }
  // {
  //   condition(_, { getState }) {
  //     const authUser = selectAuthUser(getState());
  //     const isTimelineLoading = selectIsUserTimelineLoading(
  //       authUser,
  //       getState()
  //     );
  //     return !isTimelineLoading;
  //   },
  // }
);
