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
        following: ['asma', 'aboubaker'],
      })
      .build();
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: 'Ismael',
    })(state);

    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: [
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
