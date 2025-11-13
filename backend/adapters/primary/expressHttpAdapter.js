const express = require('express');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos desde esta IP. Por favor, intente después.' },
  standardHeaders: true,
  legacyHeaders: false,
});

function createApiRouter(userService, authMiddleware, incidentService) {
  const router = express.Router();
  
  router.post('/auth/register', authLimiter, async (req, res) => {
    try {
      const { name, email, password, emergencyType, vehicleNumber } = req.body;
      
      const user = await userService.registerUser(name, email, password, emergencyType, vehicleNumber);
      
      res.status(201).json({ message: 'Usuario registrado', userId: user.id });
    
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/auth/login', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const { token, user } = await userService.loginUser(email, password);
      
      res.status(200).json({
        message: 'Login exitoso',
        token,
        user: { id: user.id, name: user.name, email: user.email } // DTO
      });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/validate-token', authMiddleware, (req, res) => {
    res.status(200).json({
      status: 'success',
      data: {
        sub: req.user.userId,
        email: req.user.email,
        emergencyType: req.user.emergencyType
      }
    });
  });

  return router;
}

module.exports = { createApiRouter };