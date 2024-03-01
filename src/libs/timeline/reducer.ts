import { messageSlice } from '@/libs/timeline/slices/message.slice.ts';
import { timelinesSlice } from '@/libs/timeline/slices/timelines.slice.ts';
import { combineReducers } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  [timelinesSlice.name]: timelinesSlice.reducer,
  [messageSlice.name]: messageSlice.reducer,
});
