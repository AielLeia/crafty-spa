import { selectAuthUser } from '@/libs/auth/reducer.ts';
import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';
import { createAction } from '@reduxjs/toolkit';

export const getAuthuserTimelinePending = createAction<{ userAuth: string }>(
  'timelines/getAuthuserTimelinePending'
);

export const getAuthUserTimeline = createAppAsyncThunk(
  'timelines/getAuthUserTimeline',
  async (_, { extra: { timelineGateway }, dispatch, getState }) => {
    const authUser = selectAuthUser(getState());
    dispatch(getAuthuserTimelinePending({ userAuth: authUser }));
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: authUser,
    });
    return timeline;
  }
);
