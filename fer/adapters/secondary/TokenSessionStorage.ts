import { ITokenStorage } from "@/lib/ports/ITokenStorage";

export class TokenSessionStorage implements ITokenStorage {
  private key: string;

  constructor(key = 'auth_token') {
    this.key = key;
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem(this.key, token);
    }
  }

  getToken(): string | null {
    if (typeof window === 'undefined' || !window.sessionStorage) return null;
    return window.sessionStorage.getItem(this.key);
  }

  clearToken(): void {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.removeItem(this.key);
    }
  }
}
