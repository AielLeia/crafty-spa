import { User } from '@/libs/users/models/user.entity.ts';

export const buildUser = ({
  id = 'user-id',
  username = 'User',
  profilePicture = 'user.png',
  followersCount = 40,
  followingCount = 50,
  isFollowedByAuthUser = false,
}: Partial<User> = {}): User => {
  return {
    id,
    username,
    profilePicture,
    followersCount,
    followingCount,
    isFollowedByAuthUser,
  };
};
