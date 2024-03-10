import { followersByUser } from '@/libs/fake-data.ts';
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/libs/users/models/user.gateway.ts';

export class FakeDateUserGateway implements UserGateway {
  getUserFollowers({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowersResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followers = followersByUser.get(userId);
        if (!followers) {
          return resolve({ followers: [] });
        }
        resolve({
          followers: followers.map((f) => ({
            id: f,
          })),
        });
      }, 500);
    });
  }
  getUserFollowing({
    userId,
  }: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followers = followersByUser.get(userId);
        if (!followers) {
          return resolve({ following: [] });
        }
        resolve({
          following: followers.map((f) => ({
            id: f,
          })),
        });
      }, 500);
    });
  }
}
