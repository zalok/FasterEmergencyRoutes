import { ITokenStorage } from "@ports/ITokenStorage";

export class TokenLocalStorage implements ITokenStorage {
  private key: string;

  constructor(key = 'auth_token') {
    this.key = key;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.key, token);
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.key);
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.key);
    }
  }
}
