import { User } from '@/libs/users/models/user.entity.ts';

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
}
