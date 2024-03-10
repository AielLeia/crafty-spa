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
        followers: ['asma', 'aboubaker'],
      })
      .build();
    const profileFollowerViewModel = createProfileFollowersViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowerViewModel).toEqual({
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: [
        {
          id: 'asma',
          username: 'asma',
          profilePicture: 'https://picsum.photos/200?random=asma',
          link: '/u/asma',
        },
        {
          id: 'aboubaker',
          username: 'aboubaker',
          profilePicture: 'https://picsum.photos/200?random=aboubaker',
          link: '/u/aboubaker',
        },
      ],
    });
  });
});
