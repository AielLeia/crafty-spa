import { createAppAsyncThunk } from '@/libs/create-app-thunk.ts';

export const getAuthUserTimeline = createAppAsyncThunk(
  'timelines/getAuthUserTimeline',
  async (_, { extra: { authGateway, timelineGateway } }) => {
    const authUser = authGateway.getAuthUser();
    const { timeline } = await timelineGateway.getUserTimeline({
      userId: authUser,
    });
    return timeline;
  }
);
