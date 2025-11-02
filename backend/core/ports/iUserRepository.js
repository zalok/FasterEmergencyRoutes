class IUserRepository {
    async findByEmail(email) {
      throw new Error("Método 'findByEmail' no implementado");
    }
  
    async save(user) {
      throw new Error("Método 'save' no implementado");
    }
  }
  
  module.exports = IUserRepository;