class IAuthService {
  generateToken(payload) {
    throw new Error("Método 'generateToken' no implementado");
  }

  verifyToken(token) {
    throw new Error("Método 'verifyToken' no implementado");
  }
}

module.exports = IAuthService;