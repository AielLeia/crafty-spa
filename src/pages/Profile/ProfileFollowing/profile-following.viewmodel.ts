import { RootState } from '@/libs/create-store.ts';
import {
  selectAreFollowingLoadingOf,
  selectFollowingOf,
} from '@/libs/users/slices/relationships.slice.ts';
import { selectUser } from '@/libs/users/slices/user.slice.ts';

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

    const following = selectFollowingOf(of, state);

    return {
      type: ProfileFollowingViewModelType.ProfileFollowingLoaded,
      following: following
        .map((followId) => {
          const user = selectUser(followId, state);

          if (!user) {
            return null;
          }

          return {
            id: user.id,
            username: user.username,
            profilePicture: user.profilePicture,
            link: `/u/${user.id}`,
            followersCount: user.followersCount,
            isFollowedByAuthUser: user.isFollowedByAuthUser,
          };
        })
        .filter(Boolean),
    };
  };
