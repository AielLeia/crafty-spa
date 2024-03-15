export type AuthUser = {
  id: string;
  username: string;
  profilePicture?: string;
};

export interface AuthGateway {
  authenticateWithGoogle(): Promise<AuthUser>;

  authenticateWithGithub(): Promise<AuthUser>;

  onAuthStateChanged(listener: (user: AuthUser) => void): void;
}
