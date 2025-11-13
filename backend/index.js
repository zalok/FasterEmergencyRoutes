const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { MongoClient } = require('mongodb');


const UserService = require('./core/services/userService');
const { createApiRouter } = require('./adapters/primary/expressHttpAdapter');
const MongoUserRepository = require('./adapters/secondary/mongoUserRepository');
const BcryptPasswordService = require('./adapters/secondary/bcryptPasswordService');
const JwtAuthService = require('./adapters/secondary/jwtAuthService');
const { createAuthMiddleware } = require('./adapters/primary/authMiddleware');
// const MongoIncidentRepository = require('./adapters/secondary/mongoIncidentRepository');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const mongoUri = process.env.MONGO_DB;
const jwtSecret = process.env.JWT_SECRET || 'emergency_secret_key';

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

    const userRepository = new MongoUserRepository(db);
    const passwordService = new BcryptPasswordService();
    const authService = new JwtAuthService(jwtSecret);

    const userService = new UserService(
      userRepository,
      passwordService,
      authService
    );

    const authMiddleware = createAuthMiddleware(authService);

    const apiRouter = createApiRouter(userService, authMiddleware);

    app.use('/api', apiRouter);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} 🚀`);
    });

  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
}

startServer();