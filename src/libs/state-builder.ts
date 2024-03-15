import { AuthUser } from '@/libs/auth/models/auth.gateway.ts';
import { RootState } from '@/libs/create-store.ts';
import {
  Notification,
  notificationAdapter,
} from '@/libs/notifications/models/notification.entity.ts';
import { rootReducer } from '@/libs/root-reducer.ts';
import {
  Message,
  messageAdapter,
} from '@/libs/timeline/models/message.entity.ts';
import {
  Timeline,
  timelinesAdapter,
} from '@/libs/timeline/models/timeline.entity.ts';
import { relationshipAdapter } from '@/libs/users/models/relationship.entity.ts';
import { User, usersAdapter } from '@/libs/users/models/user.entity.ts';
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
  UnknownAction,
} from '@reduxjs/toolkit';

const withAuthUser = createAction<{
  userAuth: AuthUser | string;
}>('withAuthUser');
const withTimeline = createAction<Timeline>('withTimeline');
const withLoadingTimelineOfUser = createAction<{ user: string }>(
  'withLoadingTimelineOfUser'
);
const withNotLoadingTimelineOfUser = createAction<{ user: string }>(
  'withNotLoadingTimelineOfUser'
);
const withMessages = createAction<Message[]>('withMessages');
const withMessageNotPosted = createAction<
  Partial<{
    messageId: string;
    errorMessage: string;
  }>
>('withMessageNotPosted');
const withMessageNotMessagesHavingFailedToBePosted = createAction<void>(
  'withMessageNotMessagesHavingFailedToBePosted'
);
const withFollowers = createAction<{ of: string; followers: string[] }>(
  'withFollowers'
);
const withFollowersNotLoading = createAction<{ of: string }>(
  'withFollowersNotLoading'
);
const withFollowersLoading = createAction<{ of: string }>(
  'withFollowersLoading'
);
const withFollowingLoading = createAction<{ of: string }>(
  'withFollowingLoading'
);
const withFollowingNotLoading = createAction<{ of: string }>(
  'withFollowingNotLoading'
);
const withFollowing = createAction<{
  of: string;
  following: string[];
}>('withFollowing');
const withUsers = createAction<User[]>('withUsers');
const withNotLoadingUser = createAction<{ userId: string }>(
  'withNotLoadingUser'
);
const withLoadingUser = createAction<{ userId: string }>('withLoadingUser');
const withNotificationNotLoading = createAction<void>(
  'withNotificationNotLoading'
);
const withNotifications = createAction<Notification[]>('withNotifications');

const initialState = rootReducer(
  undefined,
  createAction('') as unknown as UnknownAction
);

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(withAuthUser, (state, action) => {
    const { userAuth } = action.payload;
    if (typeof userAuth === 'string') {
      state.auth.authUser = {
        id: userAuth,
        username: userAuth,
      };
      return;
    }

    state.auth.authUser = userAuth;
  });

  builder.addCase(withTimeline, (state, action) => {
    timelinesAdapter.upsertOne(state.timelines.timelines, action.payload);
  });

  builder.addCase(withNotLoadingTimelineOfUser, (state, action) => {
    state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
      false;
  });

  builder.addCase(withLoadingTimelineOfUser, (state, action) => {
    state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
      true;
  });

  builder.addCase(withNotLoadingUser, (state, action) => {
    state.users.users.loadingUsers[action.payload.userId] = false;
  });

  builder.addCase(withLoadingUser, (state, action) => {
    state.users.users.loadingUsers[action.payload.userId] = true;
  });

  builder.addCase(withMessages, (state, action) => {
    messageAdapter.addMany(state.timelines.messages, action.payload);
  });

  builder.addCase(withMessageNotPosted, (state, action) => {
    const { messageId, errorMessage } = action.payload;
    if (messageId && errorMessage)
      state.timelines.messages.messagesNotPosted[messageId] = errorMessage;
  });

  builder.addCase(withMessageNotMessagesHavingFailedToBePosted, (state) => {
    state.timelines.messages.messagesNotPosted = {};
  });

  builder.addCase(withFollowers, (state, action) => {
    relationshipAdapter.addMany(
      state.users.relationships,
      action.payload.followers.map((follow) => ({
        user: follow,
        follow: action.payload.of,
      }))
    );
  });

  builder.addCase(withFollowersNotLoading, (state, action) => {
    state.users.relationships.loadingFollowersOf[action.payload.of] = false;
  });

  builder.addCase(withFollowersLoading, (state, action) => {
    state.users.relationships.loadingFollowersOf[action.payload.of] = true;
  });

  builder.addCase(withFollowingLoading, (state, action) => {
    state.users.relationships.loadingFollowingOf[action.payload.of] = true;
  });

  builder.addCase(withFollowingNotLoading, (state, action) => {
    state.users.relationships.loadingFollowingOf[action.payload.of] = false;
  });

  builder.addCase(withFollowing, (state, action) => {
    relationshipAdapter.addMany(
      state.users.relationships,
      action.payload.following.map((follow) => ({
        user: action.payload.of,
        follow: follow,
      }))
    );
  });

  builder.addCase(withUsers, (state, action) => {
    usersAdapter.addMany(state.users.users, action.payload);
  });

  builder.addCase(withNotificationNotLoading, (state) => {
    state.notifications.loading = false;
  });

  builder.addCase(withNotifications, (state, action) => {
    notificationAdapter.addMany(state.notifications, action.payload);
  });
});

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) =>
      stateBuilder(reducer(baseState, actionCreator(payload)));

  return {
    withAuthUser: (userAuth: AuthUser | string) =>
      reduce(withAuthUser)({ userAuth }),
    withTimeline: reduce(withTimeline),
    withLoadingTimelineOfUser: (user: string) =>
      reduce(withLoadingTimelineOfUser)({ user }),
    withNotLoadingTimelineOfUser: (user: string) =>
      reduce(withNotLoadingTimelineOfUser)({ user }),
    withMessages: reduce(withMessages),
    withMessageNotMessagesHavingFailedToBePosted: () =>
      reduce(withMessageNotMessagesHavingFailedToBePosted)(undefined),
    withMessageNotPosted: reduce(withMessageNotPosted),
    withFollowersNotLoading: reduce(withFollowersNotLoading),
    withFollowers: reduce(withFollowers),
    withFollowersLoading: reduce(withFollowersLoading),
    withFollowingLoading: reduce(withFollowingLoading),
    withFollowingNotLoading: reduce(withFollowingNotLoading),
    withFollowing: reduce(withFollowing),
    withUsers: reduce(withUsers),
    withNotLoadingUser: reduce(withNotLoadingUser),
    withLoadingUser: reduce(withLoadingUser),
    withNotificationNotLoading: () =>
      reduce(withNotificationNotLoading)(undefined),
    withNotifications: reduce(withNotifications),
    build(): RootState {
      return baseState;
    },
  };
};

export const stateBuilderProvider = () => {
  let builder = stateBuilder();
  return {
    getState(): RootState {
      return builder.build();
    },
    setState(updateFunction: (_builder: StateBuilder) => StateBuilder) {
      builder = updateFunction(builder);
    },
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
export type StatebuilderProvider = ReturnType<typeof stateBuilderProvider>;
