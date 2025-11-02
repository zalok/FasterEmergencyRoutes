const IAuthService = require('../../core/ports/iAuthService');
const jwt = require('jsonwebtoken');

class JwtAuthService extends IAuthService {
  
  // ¡CONSTRUCTOR CORREGIDO!
  // Ahora acepta el string 'jwtSecret' directamente.
  constructor(jwtSecret) {
    super();
    if (!jwtSecret) {
      // Esta es la única validación que debe tener.
      throw new Error("jwtSecret is required");
    }
    this.jwtSecret = jwtSecret;
    this.expiresIn = '24h';
  }

  // Implementación del puerto: Generar un token
  generateToken(payload) {
    if (!payload || !payload.userId) {
      throw new Error('Payload (con userId) es requerido para generar un token');
    }

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.expiresIn });
  }

  // Implementación del puerto: Verificar un token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }

  // ¡HEMOS ELIMINADO EL MÉTODO 'authenticate'!
  // Esa lógica no pertenece a este adaptador.
}

module.exports = JwtAuthService;