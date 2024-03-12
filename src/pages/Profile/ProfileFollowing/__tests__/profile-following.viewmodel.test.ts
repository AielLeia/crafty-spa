import { stateBuilder } from '@/libs/state-builder.ts';
import { buildUser } from '@/libs/users/__tests__/user.builder.ts';
import {
  createProfileFollowingViewModel,
  ProfileFollowingViewModelType,
} from '@/pages/Profile/ProfileFollowing/profile-following.viewmodel.ts';
import { describe, expect, test } from 'vitest';

describe('Profile following view model', () => {
  test('User following are loading', () => {
    const state = stateBuilder().withFollowingLoading({ of: 'Ismael' }).build();
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoading,
    });
  });

  test('User following are loaded', () => {
    const aboubaker = buildUser({
      id: 'aboubaker-id',
      username: 'Aboubaker',
      profilePicture: 'aboubaker.png',
      followingCount: 1,
    });
    const asma = buildUser({
      id: 'asma-id',
      username: 'Asma',
      profilePicture: 'asma.png',
      followingCount: 1,
    });
    const state = stateBuilder()
      .withFollowing({
        of: 'Ismael',
        following: ['asma-id', 'aboubaker-id'],
      })
      .withUsers([asma, aboubaker])
      .build();
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: [
        {
          id: 'asma-id',
          username: 'Asma',
          profilePicture: 'asma.png',
          link: '/u/asma-id',
          followingCount: 1,
        },
        {
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          link: '/u/aboubaker-id',
          followingCount: 1,
        },
      ],
    });
  });
});
