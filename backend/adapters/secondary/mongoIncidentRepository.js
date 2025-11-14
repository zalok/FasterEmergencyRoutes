const IIncidentRepository = require('../../core/ports/iIncidentRepository');
const Incident = require('../../core/domain/incident');
const { ObjectId } = require('mongodb');

class MongoIncidentRepository extends IIncidentRepository {
  constructor(db) {
    super();
    this.collection = db.collection('incidents');
  }

  async save(incident) {
    const now = new Date();
    const doc = {
      type: incident.type,
      location: incident.location,
      status: incident.status,
      severity: incident.severity,
      description: incident.description,
      assignedUnit: incident.assignedUnit,
      reportedBy: incident.reportedBy,
      createdAt: incident.createdAt || now,
      updatedAt: now
    };

    if (incident.id) {
      await this.collection.updateOne(
        { _id: new ObjectId(incident.id) },
        { $set: doc }
      );
      incident.updatedAt = now;
      return incident;
    } else {
      const result = await this.collection.insertOne(doc);
      incident.id = result.insertedId.toString();
      incident.createdAt = doc.createdAt;
      incident.updatedAt = doc.updatedAt;
      return incident;
    }
  }

  async findById(id) {
    const doc = await this.collection.findOne({ _id: new ObjectId(id) });
    if (!doc) return null;

    return new Incident(
      doc._id.toString(),
      doc.type,
      doc.location,
      doc.status,
      doc.severity,
      doc.description,
      doc.assignedUnit,
      doc.reportedBy,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async findRecent(limit = 10) {
    const docs = await this.collection
      .find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return docs.map(doc => new Incident(
      doc._id.toString(),
      doc.type,
      doc.location,
      doc.status,
      doc.severity,
      doc.description,
      doc.assignedUnit,
      doc.reportedBy,
      doc.createdAt,
      doc.updatedAt
    ));
  }

  async findActive() {
    const docs = await this.collection
      .find({ status: { $in: ['activo', 'en camino'] } })
      .sort({ severity: -1, createdAt: 1 })
      .toArray();

    return docs.map(doc => new Incident(
      doc._id.toString(),
      doc.type,
      doc.location,
      doc.status,
      doc.severity,
      doc.description,
      doc.assignedUnit,
      doc.reportedBy,
      doc.createdAt,
      doc.updatedAt
    ));
  }

  async getTotalCount() {
    return await this.collection.countDocuments();
  }

  async getActiveCount() {
    return await this.collection.countDocuments({ 
      status: { $in: ['activo', 'en camino'] } 
    });
  }

  async getResolvedTodayCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return await this.collection.countDocuments({
      status: 'resuelto',
      updatedAt: { $gte: today }
    });
  }

  async getAverageResponseTime() {
    // Implementar lógica para calcular tiempo promedio de respuesta
    // Por ahora retornamos un valor fijo
    return 4.2;
  }
}

module.exports = MongoIncidentRepository;