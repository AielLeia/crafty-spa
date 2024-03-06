import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { onAuthStateChangedListener } from '@/libs/auth/listeners/on-auth-state-changed.listener.ts';
import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';
import { rootReducer } from '@/libs/root-reducer.ts';
import { FakeMessageGateway } from '@/libs/timeline/infra/fake-message.gateway.ts';
import { FakeTimelineGateway } from '@/libs/timeline/infra/fake-timeline.gateway.ts';
import { RealDateProvider } from '@/libs/timeline/infra/real-date-provider.ts';
import { DateProvider } from '@/libs/timeline/models/date-provider.ts';
import { MessageGateway } from '@/libs/timeline/models/message.gateway.ts';
import { TimelineGateway } from '@/libs/timeline/models/timeline.gateway.ts';
import {
  configureStore,
  Middleware,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
  messageGateway: MessageGateway;
  dateProvider: DateProvider;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>
) => {
  const actions: UnknownAction[] = [];
  const logActionMiddleware: Middleware = () => (next) => (action) => {
    actions.push(action as UnknownAction);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }).prepend(logActionMiddleware);
    },
    preloadedState,
  });

  onAuthStateChangedListener({ store, authGateway: dependencies.authGateway });

  return {
    ...store,
    getActions() {
      return actions;
    },
  };
};

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    timelineGateway = new FakeTimelineGateway(),
    messageGateway = new FakeMessageGateway(),
    dateProvider = new RealDateProvider(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>
) =>
  createStore(
    { authGateway, timelineGateway, dateProvider, messageGateway },
    preloadedState
  );

export type AppStore = Omit<ReturnType<typeof createStore>, 'getActions'>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, UnknownAction>;
