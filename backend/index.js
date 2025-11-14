const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');

const UserService = require('./core/services/userService');
const IncidentService = require('./core/services/incidentService'); // Nuevo
const { createApiRouter } = require('./adapters/primary/expressHttpAdapter');
const MongoUserRepository = require('./adapters/secondary/mongoUserRepository');
const MongoIncidentRepository = require('./adapters/secondary/mongoIncidentRepository'); // Nuevo
const BcryptPasswordService = require('./adapters/secondary/bcryptPasswordService');
const JwtAuthService = require('./adapters/secondary/jwtAuthService');
const { createAuthMiddleware } = require('./adapters/primary/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const mongoUri = process.env.MONGO_DB;
const jwtSecret = process.env.JWT_SECRET;

app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

async function startServer() {
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    const db = client.db('emergency_tracker');
    console.log('Connected to MongoDB 🎉');

    // Inicializar repositorios
    const userRepository = new MongoUserRepository(db);
    const incidentRepository = new MongoIncidentRepository(db); // Nuevo
    
    // Inicializar servicios
    const passwordService = new BcryptPasswordService();
    const authService = new JwtAuthService(jwtSecret);

    const userService = new UserService(
      userRepository,
      passwordService,
      authService
    );

    const incidentService = new IncidentService(incidentRepository); // Nuevo

    const authMiddleware = createAuthMiddleware(authService);

    // Pasar ambos servicios al router
    const apiRouter = createApiRouter(userService, incidentService, authMiddleware);

    app.use('/api', apiRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 🚀`);
    });

  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
}

startServer();