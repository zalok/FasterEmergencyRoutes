import { IAuthApi } from "@ports/IAuthApi";

export class AuthApiFetch implements IAuthApi {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async login(email: string, password: string) {
    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Error' }));
      throw new Error(errorData.error || errorData.message || 'Error');
    }

    return await res.json();
  }

  async getSession() {
    const res = await fetch(`${this.baseUrl}/api/auth/session`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      // No hay sesión activa
      throw new Error('No hay sesión activa');
    }

    return await res.json();
  }

  async logout() {
    const res = await fetch(`${this.baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return;
  }
}
