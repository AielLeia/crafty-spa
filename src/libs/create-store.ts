import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';
import { TimelineGateway } from '@/libs/timeline/models/timeline.gateway.ts';
import { timelinesSlice } from '@/libs/timeline/slices/timelines.slice.ts';
import { configureStore, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
};

const rootReducer = timelinesSlice.reducer;

export const createStore = (dependencies: Dependencies) =>
  configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      });
    },
  });

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
