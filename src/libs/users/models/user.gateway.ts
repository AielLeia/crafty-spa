import { User } from '@/libs/users/models/user.entity.ts';

export type GetUser = {
  user: User;
};

export type GetUserFollowersResponse = {
  followers: User[];
};

export type GetUserFollowingResponse = {
  following: User[];
};

export interface UserGateway {
  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse>;

  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse>;

  getUser({ userId }: { userId: string }): Promise<GetUser>;

  followUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void>;

  unfollowUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void>;
}
