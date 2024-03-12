import { stateBuilder } from '@/libs/state-builder.ts';
import {
  createProfileFollowersViewModel,
  ProfileFollowersViewModelType,
} from '@/pages/Profile/ProfileFollowers/profile-followers.viewmodel.ts';
import { describe, expect, test } from 'vitest';

describe('Profile followers view model', () => {
  test('User followers are loading', () => {
    const state = stateBuilder().withFollowersLoading({ of: 'Ismael' }).build();
    const profileFollowerViewModel = createProfileFollowersViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowerViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoading,
    });
  });

  test('User followers are loaded', () => {
    const state = stateBuilder()
      .withFollowers({
        of: 'Ismael',
        followers: ['asma-id', 'aboubaker-id'],
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
    const profileFollowerViewModel = createProfileFollowersViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowerViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: [
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
