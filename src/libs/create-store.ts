import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';
import { rootReducer } from '@/libs/root-reducer.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { TimelineGateway } from '@/libs/timeline/models/timeline.gateway.ts';
import { configureStore, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>
) =>
  configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      });
    },
    preloadedState,
  });

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    timelineGateway = new FakeTimelineGateway(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) => createStore({ authGateway, timelineGateway }, preloadedState);

export type AppStore = ReturnType<typeof createStore>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
