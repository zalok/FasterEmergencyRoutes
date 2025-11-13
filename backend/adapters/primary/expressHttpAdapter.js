const express = require('express');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos. Por favor, intente más tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const handleError = (res, error) => {
  const safeErrorMessages = [
    "La contraseña es obligatoria.",
    "La contraseña no cumple con los requisitos: debe tener al menos 8 caracteres, una mayúscula y un número.",
    "No se pudo procesar el registro. Por favor, verifique sus datos.",
    "Credenciales inválidas"
  ];

  if (safeErrorMessages.includes(error.message)) {
    return res.status(400).json({ error: error.message });
  }

  console.error('Error Interno:', error);

  return res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
};

function createApiRouter(userService, authMiddleware) {
  const router = express.Router();
  
  router.post('/auth/register', authLimiter, async (req, res) => {
    try {
      const name = req.body.name?.trim();
      const email = req.body.email?.trim();
      const password = req.body.password;
      const emergencyType = req.body.emergencyType?.trim();
      const vehicleNumber = req.body.vehicleNumber?.trim();

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Faltan campos obligatorios." });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Formato de correo inválido." });
      }

      const user = await userService.registerUser(name, email, password, emergencyType, vehicleNumber);
      
      res.status(201).json({ message: 'Usuario registrado', userId: user.id });
    
    } catch (error) {
      handleError(res, error);
    }
  });

  router.post('/auth/login', authLimiter, async (req, res) => {
    try {
      const email = req.body.email?.trim();
      const password = req.body.password;

      if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña requeridos." }); 
      }
      
      const { token, user } = await userService.loginUser(email, password);
      
      res.status(200).json({
        message: 'Login exitoso',
        token,
        user: { id: user.id, name: user.name, email: user.email }
      });

    } catch (error) {
      handleError(res, error);
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