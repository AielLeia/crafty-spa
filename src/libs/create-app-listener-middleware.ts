import { AppDispatch, Dependencies, RootState } from '@/libs/create-store.ts';
import { createListenerMiddleware } from '@reduxjs/toolkit';

export const createAppListenerMiddleware = () =>
  createListenerMiddleware<RootState, AppDispatch, Dependencies>();
