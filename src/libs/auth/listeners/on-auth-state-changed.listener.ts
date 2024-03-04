import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';
import { userAuthenticated } from '@/libs/auth/reducer.ts';
import { AppStore } from '@/libs/create-store.ts';

export const onAuthStateChangedListener = ({
  store,
  authGateway,
}: {
  store: AppStore;
  authGateway: AuthGateway;
}) => {
  authGateway.onAuthStateChanged((optionalUser) => {
    store.dispatch(userAuthenticated({ authUser: optionalUser }));
  });
};
