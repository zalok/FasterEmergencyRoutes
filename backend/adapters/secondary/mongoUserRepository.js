const IUserRepository = require('../../core/ports/iUserRepository');
const User = require('../../core/domain/user');
const { ObjectId } = require('mongodb');

class MongoUserRepository extends IUserRepository {
  constructor(db) {
    super();
    this.collection = db.collection('users');
  }

  async findByEmail(email) {
    const doc = await this.collection.findOne({ email });
    if (!doc) return null;

    return new User(
      doc._id.toString(),
      doc.name,
      doc.email,
      doc.passwordHash || doc.password,
      doc.emergencyType,
      doc.vehicleNumber,
      doc.licenseNumber,
      doc.phone,
      doc.isActive,
      doc.currentLocation,
      doc.currentStatus,
      doc.createdAt,
      doc.updatedAt
    );
  }

  async save(user) {
    const now = new Date();
    const doc = {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      emergencyType: user.emergencyType,
      vehicleNumber: user.vehicleNumber,
      licenseNumber: user.licenseNumber,
      phone: user.phone,
      isActive: user.isActive,
      currentLocation: user.currentLocation,
      currentStatus: user.currentStatus,
      createdAt: user.createdAt || now,
      updatedAt: now
    };

    if (user.id) {
      // Actualizar existente
      await this.collection.updateOne(
        { _id: new ObjectId(user.id) },
        { $set: doc }
      );
      user.updatedAt = now;
      user.createdAt = user.createdAt || doc.createdAt;
      return user;
    } else {
      // Insertar nuevo
      const result = await this.collection.insertOne(doc);
      user.id = result.insertedId.toString();
      user.createdAt = doc.createdAt;
      user.updatedAt = doc.updatedAt;
      return user;
    }
  }
}

module.exports = MongoUserRepository;