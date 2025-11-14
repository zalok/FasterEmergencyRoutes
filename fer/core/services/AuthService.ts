import { IAuthApi } from "../../ports/IAuthApi";
import { ITokenStorage } from "../../ports/ITokenStorage";

export class AuthService {
  private api: IAuthApi;
  private storage: ITokenStorage;

  constructor(api: IAuthApi, storage: ITokenStorage) {
    this.api = api;
    this.storage = storage;
  }

  async register(name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string) {
    const result = await this.api.register(name, email, password, emergencyType, vehicleNumber);
    return result;
  }

  async login(email: string, password: string) {
    const result = await this.api.login(email, password);
    if (result && result.token) {
      this.storage.setToken(result.token);
    }
    return result;
  }

  async logout() {
    try {
      await this.api.logout();
    } catch (e) {
      // Silently fail if logout endpoint fails
    }
    this.storage.clearToken();
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  async getSession() {
    return await this.api.getSession();
  }
}