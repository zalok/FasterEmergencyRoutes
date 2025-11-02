class User {
    constructor(id, name, email, passwordHash, emergencyType, vehicleNumber, licenseNumber, phone,isActive,currentLocation,currentStatus, createdAt , updatedAt) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.passwordHash = passwordHash;
      this.emergencyType = emergencyType;
      this.vehicleNumber = vehicleNumber;
      this.phone = phone;
      this.isActive = isActive;
      this.currentLocation = currentLocation;
      this.currentStatus = currentStatus;
      this.licenseNumber = licenseNumber;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }
  
  module.exports = User;