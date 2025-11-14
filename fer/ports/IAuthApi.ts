export interface IAuthApi {
  register(name: string, email: string, password: string, emergencyType?: string, vehicleNumber?: string): Promise<any>;
  login(email: string, password: string): Promise<any>;
  getSession(): Promise<any>;
  logout(): Promise<void>;
}