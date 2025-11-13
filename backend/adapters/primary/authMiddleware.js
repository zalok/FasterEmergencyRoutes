function createAuthMiddleware(authService) {
    return (req, res, next) => {
      try {
        // 1. Obtener el encabezado 'Authorization'
        const authHeader = req.headers.authorization;
  
        // 2. Verificar si el token existe y tiene el formato "Bearer [token]"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({ 
            error: 'Acceso denegado.' 
          });
        }
  
        // 3. Extraer el token
        const token = authHeader.split(' ')[1];
        if (!token) {
          return res.status(401).json({ 
            error: 'Acceso denegado.' 
          });
        }
  
        // 4. Verificar el token usando nuestro servicio
        // El método 'verifyToken' arrojará un error si es inválido (expirado, firma incorrecta, etc.)
        const decodedPayload = authService.verifyToken(token);
  
        req.user = decodedPayload; // Contendrá { userId, email, emergencyType }
        next();
  
      } catch (error) {
        // 7. Si 'verifyToken' falla, capturamos el error aquí
        return res.status(403).json({ 
          error: 'Token inválido.' 
        });
      }
    };
  }
  
  module.exports = { createAuthMiddleware };