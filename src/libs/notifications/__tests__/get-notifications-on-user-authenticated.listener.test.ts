import { userAuthenticated } from '@/libs/auth/reducer.ts';
import { createTestStore, EMPTY_ARGS } from '@/libs/create-store.ts';
import { getNotifications } from '@/libs/notifications/usecases/get-notifications.usecase.ts';
import { describe, expect, test } from 'vitest';

describe('Getting notifications on user authentications', () => {
  test('Should get the user authentications on user authenticated action', () => {
    const store = createTestStore();

    store.dispatch(
      userAuthenticated({ authUser: { id: 'asma-id', username: 'Asma' } })
    );

    expect(store.getDispatchedUseCaseArgs(getNotifications)).toEqual(
      EMPTY_ARGS
    );
  });
});
