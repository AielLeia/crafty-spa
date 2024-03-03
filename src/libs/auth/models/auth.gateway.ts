export type AuthUser = string;

export interface AuthGateway {
  getAuthUser(): string;

  authenticateWithGoogle(): Promise<AuthUser>;

  authenticateWithGithub(): Promise<AuthUser>;
}
