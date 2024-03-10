import { relationshipsSlice } from '@/libs/users/slices/relationships.slice.ts';
import { combineReducers } from '@reduxjs/toolkit';

export const reducer = combineReducers({
  [relationshipsSlice.name]: relationshipsSlice.reducer,
});
