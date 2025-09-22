const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const mongoUri = process.env.MONGO_DB;
const client = new MongoClient(mongoUri);
const JWT_SECRET = process.env.JWT_SECRET || 'emergency_secret_key';

// Conectar a MongoDB
let db;
client.connect()
  .then(() => {
    console.log('Connected to MongoDB 🎉');
    db = client.db('emergency_tracker');
  })
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Emergency Tracker API - Sistema de seguimiento para autos de emergencia' });
});

// ========== ENDPOINTS DE AUTENTICACIÓN ==========

// POST - Registro de usuario (conductores de emergencia)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, emergencyType, vehicleNumber, licenseNumber } = req.body;
    
    // Validación
    if (!name || !email || !password || !emergencyType || !vehicleNumber) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      emergencyType, // ambulancia, policia, bomberos, etc.
      vehicleNumber,
      licenseNumber,
      isActive: false,
      currentLocation: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generar token JWT
    const token = jwt.sign(
      { userId: result.insertedId, email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: result.insertedId,
        name,
        email,
        emergencyType,
        vehicleNumber
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Login de usuario
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyType: user.emergencyType,
        vehicleNumber: user.vehicleNumber,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE VEHÍCULOS DE EMERGENCIA ==========

// GET - Obtener todos los vehículos de emergencia activos
app.get('/api/emergency-vehicles', authenticateToken, async (req, res) => {
  try {
    const vehicles = await db.collection('users').find({ 
      isActive: true,
      currentLocation: { $exists: true, $ne: null }
    }).project({
      password: 0,
      licenseNumber: 0
    }).toArray();
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener vehículos por tipo de emergencia
app.get('/api/emergency-vehicles/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    const vehicles = await db.collection('users').find({ 
      emergencyType: type,
      isActive: true,
      currentLocation: { $exists: true, $ne: null }
    }).project({
      password: 0,
      licenseNumber: 0
    }).toArray();
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar ubicación del vehículo
app.put('/api/update-location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, status } = req.body;
    const userId = req.user.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          currentLocation: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          isActive: status !== 'inactive',
          updatedAt: new Date()
        }
      }
    );

    // Registrar el historial de ubicación
    await db.collection('location_history').insertOne({
      userId: new ObjectId(userId),
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      timestamp: new Date()
    });

    res.json({ message: 'Ubicación actualizada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Cambiar estado del vehículo (activo/inactivo)
app.put('/api/vehicle-status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.userId;

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          isActive: status === 'active',
          updatedAt: new Date()
        }
      }
    );

    res.json({ 
      message: `Estado actualizado a ${status === 'active' ? 'activo' : 'inactivo'}`,
      isActive: status === 'active'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE INCIDENTES/EMERGENCIAS ==========

// POST - Reportar un incidente/emergencia
app.post('/api/incidents', authenticateToken, async (req, res) => {
  try {
    const { type, description, latitude, longitude, severity } = req.body;
    const userId = req.user.userId;

    if (!type || !latitude || !longitude) {
      return res.status(400).json({ error: 'Tipo, latitud y longitud son requeridos' });
    }

    const result = await db.collection('incidents').insertOne({
      type, // accidente, incendio, medical, etc.
      description,
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      severity: severity || 'medium',
      reportedBy: new ObjectId(userId),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Incidente reportado exitosamente',
      incidentId: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener incidentes activos
app.get('/api/incidents', authenticateToken, async (req, res) => {
  try {
    const incidents = await db.collection('incidents')
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar estado de incidente
app.put('/api/incidents/:id', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const result = await db.collection('incidents').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status,
          updatedAt: new Date(),
          resolvedBy: new ObjectId(req.user.userId),
          resolvedAt: status === 'resolved' ? new Date() : null
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    res.json({ message: `Incidente ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE RUTAS ==========

// POST - Calcular ruta óptima hacia un incidente
app.post('/api/calculate-route', authenticateToken, async (req, res) => {
  try {
    const { incidentId, currentLat, currentLng } = req.body;
    const userId = req.user.userId;

    // Obtener detalles del incidente
    const incident = await db.collection('incidents').findOne({ 
      _id: new ObjectId(incidentId) 
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    // En una implementación real, aquí integrarías con Google Maps API o similar
    // Por ahora, devolvemos una ruta simulada
    const simulatedRoute = {
      distance: "5.2 km",
      duration: "12 minutos",
      polyline: "simulated_polyline_data",
      steps: [
        "Diríjase al norte por Av. Principal",
        "Gire a la derecha en Calle Secundaria",
        "Continúe 2km hasta el destino"
      ]
    };

    // Registrar la asignación de ruta
    await db.collection('route_assignments').insertOne({
      userId: new ObjectId(userId),
      incidentId: new ObjectId(incidentId),
      route: simulatedRoute,
      assignedAt: new Date(),
      status: 'assigned'
    });

    res.json({
      message: 'Ruta calculada exitosamente',
      route: simulatedRoute,
      incident: {
        type: incident.type,
        severity: incident.severity,
        location: incident.location
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== END ENDPOINTS ==========

app.listen(PORT, () => {
  console.log(`Emergency Tracker Server running on http://localhost:${PORT}`);
});