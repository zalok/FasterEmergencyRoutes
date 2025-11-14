export interface Incident {
  id: string;
  type: string;
  location: string;
  status: 'activo' | 'en camino' | 'resuelto';
  severity: 'baja' | 'media' | 'alta' | 'critica';
  description?: string;
  assignedUnit?: string;
  reportedBy?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedToday: number;
  averageResponseTime: string;
}

export interface IIncidentApi {
  getDashboardStats(): Promise<DashboardStats>;
  getRecentIncidents(): Promise<Incident[]>;
  getActiveIncidents(): Promise<Incident[]>;
  createIncident(incident: Omit<Incident, 'id' | 'timestamp' | 'createdAt' | 'updatedAt'>): Promise<Incident>;
}