import { AuthGateway, AuthUser } from '@/libs/auth/models/auth.gateway.ts';

export class FakeAuthGateway implements AuthGateway {
  willSucceedForGoogleAuthForUser!: string;

  willSucceedForGithubAuthForUser!: string;

  constructor(private readonly delay = 0) {}

  authenticateWithGoogle(): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.willSucceedForGoogleAuthForUser);
      }, this.delay);
    });
  }

  authenticateWithGithub(): Promise<AuthUser> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.willSucceedForGithubAuthForUser);
      }, this.delay);
    });
  }
}
