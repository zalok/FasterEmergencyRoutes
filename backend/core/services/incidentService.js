const Incident = require('../domain/incident');

class IncidentService {
  constructor(incidentRepository) {
    this.incidentRepository = incidentRepository;
  }

  async getDashboardStats() {
    const totalIncidents = await this.incidentRepository.getTotalCount();
    const activeIncidents = await this.incidentRepository.getActiveCount();
    const resolvedToday = await this.incidentRepository.getResolvedTodayCount();
    
    // Calcular tiempo promedio de respuesta (ejemplo)
    const averageResponseTime = await this.incidentRepository.getAverageResponseTime();
    
    return {
      totalIncidents,
      activeIncidents,
      resolvedToday,
      averageResponseTime: averageResponseTime ? `${averageResponseTime} min` : "4.2 min"
    };
  }

  async getRecentIncidents(limit = 10) {
    return await this.incidentRepository.findRecent(limit);
  }

  async getActiveIncidents() {
    return await this.incidentRepository.findActive();
  }

  async getIncidentById(id) {
    return await this.incidentRepository.findById(id);
  }

  async createIncident(incidentData) {
    const incident = new Incident(
      null,
      incidentData.type,
      incidentData.location,
      incidentData.status,
      incidentData.severity,
      incidentData.description,
      incidentData.assignedUnit,
      incidentData.reportedBy,
      new Date(),
      new Date()
    );

    return await this.incidentRepository.save(incident);
  }

  async updateIncident(id, updateData) {
    const incident = await this.incidentRepository.findById(id);
    if (!incident) {
      return null;
    }

    // Actualizar campos permitidos
    if (updateData.status) incident.status = updateData.status;
    if (updateData.assignedUnit) incident.assignedUnit = updateData.assignedUnit;
    if (updateData.severity) incident.severity = updateData.severity;
    
    incident.updatedAt = new Date();

    return await this.incidentRepository.save(incident);
  }
}

module.exports = IncidentService;