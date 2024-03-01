import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';

export class FakeAuthGateway implements AuthGateway {
  authUser!: string;

  getAuthUser(): string {
    return this.authUser;
  }
}
