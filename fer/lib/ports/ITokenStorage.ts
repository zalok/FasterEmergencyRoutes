export interface ITokenStorage {
  setToken(token: string): void;
  getToken(): string | null;
  clearToken(): void;
}
