const express = require('express');

function createApiRouter(userService, incidentService) {
  const router = express.Router();

  router.post('/auth/register', async (req, res) => {
    try {
      const { name, email, password, emergencyType, vehicleNumber } = req.body;
      
      const user = await userService.registerUser(name, email, password, emergencyType, vehicleNumber);
      
      res.status(201).json({ message: 'Usuario registrado', userId: user.id });
    
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.post('/auth/login', async (req, res) => {
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

  return router;
}

module.exports = { createApiRouter };