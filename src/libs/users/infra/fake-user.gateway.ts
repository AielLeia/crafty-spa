import { User } from '@/libs/users/models/user.entity.ts';
import {
  GetUser,
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/libs/users/models/user.gateway.ts';

export class FakeUserGateway implements UserGateway {
  willRespondForGetUserFollowers = new Map<string, GetUserFollowersResponse>();
  willRespondForGetUserFollowing = new Map<string, GetUserFollowingResponse>();
  users = new Map<string, User>();
  lastFollowedUserBy!: { userId: string; followingId: string };
  lastUnfollowedUserBy!: { userId: string; followingId: string };

  unfollowUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void> {
    this.lastUnfollowedUserBy = { userId, followingId };

    return Promise.resolve();
  }

  followUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void> {
    this.lastFollowedUserBy = { userId, followingId };

    return Promise.resolve();
  }

  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse> {
    const response = this.willRespondForGetUserFollowers.get(userId);

    if (!response) {
      return Promise.reject();
    }

    return Promise.resolve(response);
  }

  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    const response = this.willRespondForGetUserFollowing.get(userId);

    if (!response) {
      return Promise.reject();
    }

    return Promise.resolve(response);
  }

  getUser({ userId }: { userId: string }): Promise<GetUser> {
    const user = this.users.get(userId);

    if (!user) {
      return Promise.reject();
    }

    return Promise.resolve({ user });
  }

  givenGetUserFollowersResponseFor({
    user,
    followers,
  }: {
    user: string;
    followers: User[];
  }) {
    this.willRespondForGetUserFollowers.set(user, {
      followers,
    });
  }

  givenGetUserFollowingResponseFor({
    following,
    user,
  }: {
    user: string;
    following: User[];
  }) {
    this.willRespondForGetUserFollowing.set(user, {
      following,
    });
  }
}
