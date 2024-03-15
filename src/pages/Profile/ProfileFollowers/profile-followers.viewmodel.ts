import { RootState } from '@/libs/create-store.ts';
import {
  selectAreFollowersLoadingOf,
  selectFollowersOf,
} from '@/libs/users/slices/relationships.slice.ts';
import { selectUser } from '@/libs/users/slices/user.slice.ts';

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
      followers: followers
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
