import { userAuthenticated } from '@/libs/auth/reducer.ts';
import { createAppListenerMiddleware } from '@/libs/create-app-listener-middleware.ts';
import { getNotifications } from '@/libs/notifications/usecases/get-notifications.usecase.ts';

const listener = createAppListenerMiddleware();

export const getNotificationsOnUserAuthenticatedListener = () => {
  listener.startListening({
    actionCreator: userAuthenticated,
    effect: async (_, { dispatch }) => {
      dispatch(getNotifications());
    },
  });

  return listener.middleware;
};
