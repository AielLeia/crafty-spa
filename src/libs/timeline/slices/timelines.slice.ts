import { getAuthUserTimeline } from '@/libs/timeline/usecases/get-auth-user-timeline.usecase.ts';
import { createSlice } from '@reduxjs/toolkit';

type TimelinesState = {
  user: string;
  messages: {
    text: string;
    author: string;
    publishedAt: string;
  }[];
};

export const timelinesSlice = createSlice({
  name: 'timelines',
  initialState: {} as TimelinesState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getAuthUserTimeline.fulfilled, (_, action) => {
      return action.payload;
    });
  },
});
