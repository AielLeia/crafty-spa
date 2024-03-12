import { relationshipsSlice } from '@/libs/users/slices/relationships.slice.ts';
import { userSlice } from '@/libs/users/slices/user.slice.ts';
import { combineReducers } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});
