import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AuthGateway, AuthUser } from '@/libs/auth/models/auth.gateway.ts';
import { z } from 'zod';

export class FakeStorageAuthGateway implements AuthGateway {
  constructor(private readonly fakeAuthGateway: FakeAuthGateway) {}

  async authenticateWithGoogle(): Promise<AuthUser> {
    const authUser = await this.fakeAuthGateway.authenticateWithGoogle();
    localStorage.setItem('fakeAuth', JSON.stringify(authUser));
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);
    return authUser;
  }
  async authenticateWithGithub(): Promise<AuthUser> {
    const authUser = await this.fakeAuthGateway.authenticateWithGithub();
    localStorage.setItem('fakeAuth', JSON.stringify(authUser));
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);
    return authUser;
  }
  onAuthStateChanged(listener: (user: AuthUser) => void): void {
    this.fakeAuthGateway.onAuthStateChanged(listener);
    this.checkIfAuthenticated();
  }

  private checkIfAuthenticated() {
    const optionalUser = localStorage.getItem('fakeAuth');

    if (optionalUser !== null) {
      const jsonAuthUser = JSON.parse(optionalUser);

      const AuthUserSchema = z.object({
        id: z.string(),
        username: z.string(),
        profilePicture: z.string().optional(),
      });

      const authUserResult = AuthUserSchema.safeParse(jsonAuthUser);

      if (authUserResult.success) {
        const { id, username, profilePicture } = authUserResult.data;
        const authUser: AuthUser = {
          id,
          username,
          profilePicture,
        };
        this.fakeAuthGateway.simulateAuthStateChanged(authUser);
      }
    }
  }
}
