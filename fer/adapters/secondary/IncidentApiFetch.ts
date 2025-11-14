import { IIncidentApi, Incident, DashboardStats } from "../../core/ports/IIncidentApi";

export class IncidentApiFetch implements IIncidentApi {
  private baseUrl: string;

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/api/dashboard/stats`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener estadísticas del dashboard');
    }

    return await res.json();
  }

  async getRecentIncidents(): Promise<Incident[]> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/api/incidents/recent`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener incidentes recientes');
    }

    const data = await res.json();
    return data.incidents || [];
  }

  async getActiveIncidents(): Promise<Incident[]> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/api/incidents/active`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error al obtener incidentes activos');
    }

    const data = await res.json();
    return data.incidents || [];
  }

  async createIncident(incident: Omit<Incident, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>): Promise<Incident> {
    const token = this.getToken();
    const res = await fetch(`${this.baseUrl}/api/incidents`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(incident)
    });

    if (!res.ok) {
      throw new Error('Error al crear incidente');
    }

    return await res.json();
  }

  private getToken(): string {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '';
    }
    return '';
  }
}