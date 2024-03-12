import { followersByUser, followingByUser, users } from '@/libs/fake-data.ts';
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

        return resolve({
          followers: followers
            .map((f) => {
              const user = users.get(f);
              if (!user) return null;

              const followingCount = (followingByUser.get(user.id) ?? [])
                .length;

              return {
                id: f,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount: followers.length,
                followingCount,
              };
            })
            .filter(Boolean),
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
        const following = followingByUser.get(userId);

        if (!following) {
          return resolve({ following: [] });
        }

        return resolve({
          following: following
            .map((f) => {
              const user = users.get(f);
              if (!user) return null;

              const followersCount = (followersByUser.get(user.id) ?? [])
                .length;

              return {
                id: f,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount,
                followingCount: following.length,
              };
            })
            .filter(Boolean),
        });
      }, 500);
    });
  }
}
