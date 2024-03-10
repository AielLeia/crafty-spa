import { RootState } from '@/libs/create-store.ts';
import {
  selectAreFollowingLoadingOf,
  selectFollowingOf,
} from '@/libs/users/slices/relationships.slice.ts';

export const ProfileFollowingViewModelType = {
  ProfileFollowingLoading: 'PROFILE_FOLLOWING_LOADING',
  ProfileFollowingLoaded: 'PROFILE_FOLLOWING_LOADED',
} as const;

export const createProfileFollowingViewModel =
  ({ of }: { of: string }) =>
  (state: RootState) => {
    const areFollowersLoading = selectAreFollowingLoadingOf(of, state);
    if (areFollowersLoading) {
      return {
        type: ProfileFollowingViewModelType.ProfileFollowingLoading,
      };
    }

    const followers = selectFollowingOf(of, state);

    return {
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: followers.map((f) => ({
        id: `${f}`,
        username: `${f}`,
        profilePicture: `https://picsum.photos/200?random=${f}`,
        link: `/u/${f}`,
      })),
    };
  };
