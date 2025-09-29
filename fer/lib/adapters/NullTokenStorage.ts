import { ITokenStorage } from "@/lib/ports/ITokenStorage";

export class NullTokenStorage implements ITokenStorage {
  setToken(_: string): void {
  }
  getToken(): string | null {
    return null;
  }
  clearToken(): void {
  }
}
