import { FakeAuthGateway } from '@/libs/auth/infra/fake-auth.gateway.ts';
import { AuthGateway } from '@/libs/auth/models/auth.gateway.ts';

export class FakeStorageAuthGateway implements AuthGateway {
  constructor(private readonly fakeAuthGateway: FakeAuthGateway) {}

  async authenticateWithGoogle(): Promise<string> {
    const authUser = await this.fakeAuthGateway.authenticateWithGoogle();
    localStorage.setItem('fakeAuth', authUser);
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);
    return authUser;
  }
  async authenticateWithGithub(): Promise<string> {
    const authUser = await this.fakeAuthGateway.authenticateWithGithub();
    localStorage.setItem('fakeAuth', authUser);
    this.fakeAuthGateway.onAuthStateChangedListener(authUser);
    return authUser;
  }
  onAuthStateChanged(listener: (user: string) => void): void {
    this.fakeAuthGateway.onAuthStateChanged(listener);
    this.checkIfAuthenticated();
  }

  private checkIfAuthenticated() {
    const optionalUser = localStorage.getItem('fakeAuth');

    if (optionalUser !== null) {
      this.fakeAuthGateway.simulateAuthStateChanged(optionalUser);
    }
  }
}
