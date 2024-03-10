import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/libs/users/models/user.gateway.ts';

export class FakeUserGateway implements UserGateway {
  willRespondForGetUserFollowers = new Map<string, GetUserFollowersResponse>();
  willRespondForGetUserFollowing = new Map<string, GetUserFollowingResponse>();

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

  givenGetUserFollowersResponseFor({
    user,
    followers,
  }: {
    user: string;
    followers: string[];
  }) {
    this.willRespondForGetUserFollowers.set(user, {
      followers: followers.map((fId) => ({ id: fId })),
    });
  }

  givenGetUserFollowingResponseFor({
    following,
    user,
  }: {
    user: string;
    following: string[];
  }) {
    this.willRespondForGetUserFollowing.set(user, {
      following: following.map((fId) => ({ id: fId })),
    });
  }
}
