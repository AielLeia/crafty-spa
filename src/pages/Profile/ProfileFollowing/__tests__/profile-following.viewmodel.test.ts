import { stateBuilder } from '@/libs/state-builder.ts';
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
    const state = stateBuilder()
      .withFollowing({
        of: 'Ismael',
        following: ['asma-id', 'aboubaker-id'],
      })
      .withUsers([
        {
          id: 'asma-id',
          username: 'Asma',
          profilePicture: 'asma.png',
          followersCount: 50,
          followingCount: 1,
        },
        {
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          followersCount: 50,
          followingCount: 1,
        },
      ])
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
          followersCount: 50,
          followingCount: 1,
        },
        {
          id: 'aboubaker-id',
          username: 'Aboubaker',
          profilePicture: 'aboubaker.png',
          link: '/u/aboubaker-id',
          followersCount: 50,
          followingCount: 1,
        },
      ],
    });
  });
});
