class IPasswordService {
    async hash(password) {
      throw new Error("Método 'hash' no implementado");
    }
  
    async compare(password, hash) {
      throw new Error("Método 'compare' no implementado");
    }
  }
  
  module.exports = IPasswordService;