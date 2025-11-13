const IAuthService = require('../../core/ports/iAuthService');
const jwt = require('jsonwebtoken');

class JwtAuthService extends IAuthService {
  
  constructor(jwtSecret) {
    super();
    if (!jwtSecret) {
      throw new Error("jwtSecret is required");
    }
    this.jwtSecret = jwtSecret;
    this.expiresIn = '24h';
  }

  generateToken(payload) {
    if (!payload || !payload.userId) {
      throw new Error('Payload (con userId) es requerido para generar un token');
    }

    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.expiresIn });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}

module.exports = JwtAuthService;