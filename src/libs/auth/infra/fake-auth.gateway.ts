import { AuthGateway, AuthUser } from '@/libs/auth/models/auth.gateway.ts';

export class FakeAuthGateway implements AuthGateway {
  authUser!: string;

  willSucceedForGoogleAuthForUser!: string;

  willSucceedForGithubAuthForUser!: string;

  constructor(private readonly delay = 0) {}

  getAuthUser(): string {
    return this.authUser;
  }

  authenticateWithGoogle(): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.authUser = this.willSucceedForGoogleAuthForUser;
        resolve(this.willSucceedForGoogleAuthForUser);
      }, this.delay);
    });
  }

  authenticateWithGithub(): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.authUser = this.willSucceedForGithubAuthForUser;
        resolve(this.willSucceedForGithubAuthForUser);
      }, this.delay);
    });
  }
}
