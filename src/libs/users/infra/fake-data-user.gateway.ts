import {
  followersByUser,
  followingByUser,
  isAuthUserFollowsUser,
  users,
} from '@/libs/fake-data.ts';
import {
  GetUser,
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/libs/users/models/user.gateway.ts';

export class FakeDataUserGateway implements UserGateway {
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
                isFollowedByAuthUser: isAuthUserFollowsUser(user.id),
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
                isFollowedByAuthUser: isAuthUserFollowsUser(user.id),
              };
            })
            .filter(Boolean),
        });
      }, 500);
    });
  }

  getUser({ userId }: { userId: string }): Promise<GetUser> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.get(userId);

        if (!user) {
          return reject();
        }

        const followingCount = (followingByUser.get(user.id) ?? []).length;
        const followersCount = (followersByUser.get(user.id) ?? []).length;

        return resolve({
          user: {
            ...user,
            followingCount,
            followersCount,
            isFollowedByAuthUser: isAuthUserFollowsUser(user.id),
          },
        });
      }, 500);
    });
  }
  followUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const existingFollowers = followersByUser.get(userId) ?? [];
        followersByUser.set(userId, existingFollowers.concat(followingId));

        return resolve();
      }, 500);
    });
  }
  unfollowUser({
    userId,
    followingId,
  }: {
    userId: string;
    followingId: string;
  }): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const existingFollowers = followersByUser.get(userId) ?? [];
        followersByUser.set(
          userId,
          existingFollowers.filter((u) => u !== followingId)
        );
        const followings = followingByUser.get(followingId) ?? [];
        followingByUser.set(
          followingId,
          followings.filter((u) => u !== userId)
        );
        resolve();
      }, 500)
    );
  }
}
