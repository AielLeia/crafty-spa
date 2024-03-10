import { reducer as authRootReducer } from '@/libs/auth/reducer.ts';
import { reducer as timelineRootReducer } from '@/libs/timeline/reducer.ts';
import { reducer as usersRootReducer } from '@/libs/users/reducer.ts';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  timelines: timelineRootReducer,
  auth: authRootReducer,
  users: usersRootReducer,
});
