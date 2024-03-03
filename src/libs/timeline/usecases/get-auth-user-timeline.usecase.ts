import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';
import { createAction } from '@reduxjs/toolkit';

export const getAuthuserTimelinePending = createAction<{ userAuth: string }>(
  'timelines/getAuthuserTimelinePending'
);

export const getAuthUserTimeline = createAppAsyncThunk(
  'timelines/getAuthUserTimeline',
  async (_, { extra: { authGateway, timelineGateway }, dispatch }) => {
    const authUser = authGateway.getAuthUser();
    dispatch(
      getAuthuserTimelinePending({ userAuth: authGateway.getAuthUser() })
    );
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: authUser,
    });
    return timeline;
  }
);
