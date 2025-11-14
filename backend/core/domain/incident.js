class Incident {
  constructor(
    id, 
    type, 
    location, 
    status, 
    severity = 'media', 
    description = '', 
    assignedUnit = '', 
    reportedBy = '',
    createdAt = new Date(), 
    updatedAt = new Date()
  ) {
    this.id = id;
    this.type = type;
    this.location = location;
    this.status = status;
    this.severity = severity;
    this.description = description;
    this.assignedUnit = assignedUnit;
    this.reportedBy = reportedBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Incident;