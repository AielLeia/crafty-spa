import { RootState } from '@/libs/create-store.ts';
import {
  selectAreFollowersLoadingOf,
  selectFollowersOf,
} from '@/libs/users/slices/relationships.slice.ts';

export const ProfileFollowersViewModelType = {
  ProfileFollowersLoading: 'PROFILE_FOLLOWERS_LOADING',
  ProfileFollowersLoaded: 'PROFILE_FOLLOWERS_LOADED',
} as const;

export const createProfileFollowersViewModel =
  ({ of }: { of: string }) =>
  (state: RootState) => {
    const areFollowersLoading = selectAreFollowersLoadingOf(of, state);
    if (areFollowersLoading) {
      return {
        type: ProfileFollowersViewModelType.ProfileFollowersLoading,
      };
    }

    const followers = selectFollowersOf(of, state);

    return {
      type: ProfileFollowersViewModelType.ProfileFollowersLoaded,
      followers: followers.map((f) => ({
        id: `${f}`,
        username: `${f}`,
        profilePicture: `https://picsum.photos/200?random=${f}`,
        link: `/u/${f}`,
      })),
    };
  };
