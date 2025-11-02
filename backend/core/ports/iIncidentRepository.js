class IIncidentRepository {
    async createIncident(incidentData) {
      throw new Error("Método 'createIncident' no implementado");
    }

    async getActiveIncidents() {
        throw new Error("Método 'getActiveIncidents' no implementado");
    }
}

module.exports = IIncidentRepository;