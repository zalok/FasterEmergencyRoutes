class IIncidentRepository {
  async save(incident) {
    throw new Error("Método 'save' no implementado");
  }

  async findById(id) {
    throw new Error("Método 'findById' no implementado");
  }

  async findRecent(limit) {
    throw new Error("Método 'findRecent' no implementado");
  }

  async findActive() {
    throw new Error("Método 'findActive' no implementado");
  }

  async getTotalCount() {
    throw new Error("Método 'getTotalCount' no implementado");
  }

  async getActiveCount() {
    throw new Error("Método 'getActiveCount' no implementado");
  }

  async getResolvedTodayCount() {
    throw new Error("Método 'getResolvedTodayCount' no implementado");
  }

  async getAverageResponseTime() {
    throw new Error("Método 'getAverageResponseTime' no implementado");
  }
}

module.exports = IIncidentRepository;