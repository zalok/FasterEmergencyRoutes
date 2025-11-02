class Incident {
    constructor(id, type, location, severity, description, reportedAt) {
      this.id = id;
      this.type = type;
      this.location = location;
      this.severity = severity;
      this.description = description;
      this.reportedAt = reportedAt;
    }
}

module.exports = Incident;