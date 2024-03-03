import { RootState } from '@/libs/create-store.ts';
import { rootReducer } from '@/libs/root-reducer.ts';
import {
  Message,
  messageAdapter,
} from '@/libs/timeline/models/message.entity.ts';
import {
  Timeline,
  timelinesAdapter,
} from '@/libs/timeline/models/timeline.entity.ts';
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
  UnknownAction,
} from '@reduxjs/toolkit';

const withAuthUser = createAction<{ userAuth: string }>('withAuthUser');
const withTimeline = createAction<Timeline>('withTimeline');
const withLoadingTimelineOfUser = createAction<{ user: string }>(
  'withLoadingTimelineOfUser'
);
const withNotLoadingTimelineOfUser = createAction<{ user: string }>(
  'withNotLoadingTimelineOfUser'
);
const withMessages = createAction<Message[]>('withMessages');

const initialState = rootReducer(
  undefined,
  createAction('') as unknown as UnknownAction
);

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(withAuthUser, (state, action) => {
    state.auth.authUser = action.payload.userAuth;
  });
  builder.addCase(withTimeline, (state, action) => {
    timelinesAdapter.addOne(state.timelines.timelines, action.payload);
  });
  builder.addCase(withNotLoadingTimelineOfUser, (state, action) => {
    state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
      false;
  });
  builder.addCase(withLoadingTimelineOfUser, (state, action) => {
    state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
      true;
  });
  builder.addCase(withMessages, (state, action) => {
    messageAdapter.addMany(state.timelines.messages, action.payload);
  });
});

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(baseState, actionCreator(payload)));

  return {
    withAuthUser: (userAuth: string) => reduce(withAuthUser)({ userAuth }),
    withTimeline: reduce(withTimeline),
    withLoadingTimelineOfUser: (user: string) =>
      reduce(withLoadingTimelineOfUser)({ user }),
    withNotLoadingTimelineOfUser: (user: string) =>
      reduce(withNotLoadingTimelineOfUser)({ user }),
    withMessages: reduce(withMessages),
    build(): RootState {
      return baseState;
    },
  };
};
