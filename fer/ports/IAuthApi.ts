export interface IAuthApi {
  login(email: string, password: string): Promise<{ token?: string; user?: any }>;
  getSession(): Promise<{ user?: any }>;
  logout(): Promise<void>;
}