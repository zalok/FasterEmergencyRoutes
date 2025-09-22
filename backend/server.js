const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { StrongPassword } = require('./patterns/passwordStrategy');
const { ConsoleEmail } = require('./patterns/notificationAdapter');
const { Subject, LoginLogger } = require('./patterns/observer');

dotenv.config();

const mongoUri = process.env.MONGO_DB;
const client = new MongoClient(mongoUri);
const JWT_SECRET = process.env.JWT_SECRET || 'emergency_secret_key_change_in_production';

const loginSubject = new Subject();
loginSubject.subscribe(new LoginLogger());

// Conectar a MongoDB
let db;
client.connect()
  .then(() => {
    console.log('Connected to MongoDB 🎉');
    db = client.db('emergency_tracker');
    
    // Crear índices para mejor rendimiento
    db.collection('users').createIndex({ email: 1 }, { unique: true });
    db.collection('users').createIndex({ currentLocation: "2dsphere" });
    db.collection('incidents').createIndex({ location: "2dsphere" });
    db.collection('location_history').createIndex({ userId: 1, timestamp: -1 });
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
  res.json({ 
    message: 'Emergency Tracker API - Sistema de seguimiento para autos de emergencia',
    version: '1.0.0'
  });
});

// ========== ENDPOINTS DE AUTENTICACIÓN ==========

// POST - Registro de usuario (conductores de emergencia)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, emergencyType, vehicleNumber, licenseNumber, phone } = req.body;
    
    // Validación
    if (!name || !email || !password || !emergencyType || !vehicleNumber) {
      return res.status(400).json({ error: 'Nombre, email, contraseña, tipo de emergencia y número de vehículo son requeridos' });
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
      phone: phone || '',
      isActive: false,
      currentLocation: null,
      currentStatus: 'available', // available, busy, offline
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Generar token JWT
    const token = jwt.sign(
      { 
        userId: result.insertedId, 
        email,
        emergencyType 
      }, 
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
        vehicleNumber,
        phone: phone || '',
        isActive: false,
        currentStatus: 'available'
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

    if (!email || !password)
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });

    const user = await db.collection('users').findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    // Strategy: validación de contraseña
    const passwordValidator = new StrongPassword();
    if (!passwordValidator.validate(password)) {
      return res.status(400).json({ error: 'Contraseña no cumple requisitos de seguridad' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { userId: user._id, email: user.email, emergencyType: user.emergencyType },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Observer: log de auditoría
    loginSubject.notify({ user: email, time: new Date() });

    // Adapter: enviar notificación
    const notifier = new ConsoleEmail();
    notifier.send(`Usuario ${email} ha iniciado sesión`);

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        emergencyType: user.emergencyType,
        vehicleNumber: user.vehicleNumber,
        phone: user.phone || '',
        isActive: user.isActive,
        currentStatus: user.currentStatus || 'available',
        currentLocation: user.currentLocation
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Perfil de usuario
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(req.user.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE VEHÍCULOS DE EMERGENCIA ==========

// GET - Obtener todos los vehículos de emergencia
app.get('/api/emergency-vehicles', authenticateToken, async (req, res) => {
  try {
    const { type, status, active } = req.query;
    
    let query = {};
    
    if (type) query.emergencyType = type;
    if (status) query.currentStatus = status;
    if (active !== undefined) query.isActive = active === 'true';
    
    const vehicles = await db.collection('users').find(query)
      .project({
        password: 0,
        licenseNumber: 0
      })
      .toArray();
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener vehículos cercanos a una ubicación
app.get('/api/emergency-vehicles/nearby', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000, type } = req.query; // maxDistance en metros
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    let query = {
      isActive: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    if (type) query.emergencyType = type;

    const vehicles = await db.collection('users').find(query)
      .project({
        password: 0,
        licenseNumber: 0
      })
      .toArray();
    
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar ubicación del vehículo
app.put('/api/vehicle/location', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, status } = req.body;
    const userId = req.user.userId;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    const updateData = {
      currentLocation: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      updatedAt: new Date()
    };

    if (status) {
      updateData.currentStatus = status;
      updateData.isActive = status !== 'offline';
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateData }
    );

    // Registrar el historial de ubicación
    await db.collection('location_history').insertOne({
      userId: new ObjectId(userId),
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      status: status || 'available',
      timestamp: new Date()
    });

    res.json({ 
      message: 'Ubicación actualizada exitosamente',
      location: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Cambiar estado del vehículo
app.put('/api/vehicle/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.user.userId;

    if (!['available', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido. Use: available, busy, offline' });
    }

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          currentStatus: status,
          isActive: status !== 'offline',
          updatedAt: new Date()
        }
      }
    );

    res.json({ 
      message: `Estado actualizado a ${status}`,
      currentStatus: status,
      isActive: status !== 'offline'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE INCIDENTES/EMERGENCIAS ==========

// POST - Reportar un incidente/emergencia
app.post('/api/incidents', authenticateToken, async (req, res) => {
  try {
    const { type, description, latitude, longitude, severity, address } = req.body;
    const userId = req.user.userId;

    if (!type || !latitude || !longitude) {
      return res.status(400).json({ error: 'Tipo, latitud y longitud son requeridos' });
    }

    const incident = await db.collection('incidents').insertOne({
      type, // accidente, incendio, medical, criminal, etc.
      description: description || '',
      address: address || '',
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      severity: severity || 'medium',
      reportedBy: new ObjectId(userId),
      status: 'active',
      assignedTo: null,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({
      message: 'Incidente reportado exitosamente',
      incidentId: incident.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener incidentes
app.get('/api/incidents', authenticateToken, async (req, res) => {
  try {
    const { status, type, severity } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (severity) query.severity = severity;

    const incidents = await db.collection('incidents')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    // Populate reportedBy information
    const incidentsWithUsers = await Promise.all(
      incidents.map(async (incident) => {
        if (incident.reportedBy) {
          const user = await db.collection('users').findOne(
            { _id: incident.reportedBy },
            { projection: { name: 1, emergencyType: 1, vehicleNumber: 1 } }
          );
          incident.reportedByUser = user;
        }
        return incident;
      })
    );

    res.json(incidentsWithUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener incidentes cercanos
app.get('/api/incidents/nearby', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000, status = 'active' } = req.query;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitud y longitud son requeridas' });
    }

    const incidents = await db.collection('incidents')
      .find({
        status: status,
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            $maxDistance: parseInt(maxDistance)
          }
        }
      })
      .sort({ severity: -1, createdAt: -1 })
      .toArray();

    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener incidente por ID
app.get('/api/incidents/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const incident = await db.collection('incidents').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    // Obtener información del usuario que reportó
    if (incident.reportedBy) {
      const user = await db.collection('users').findOne(
        { _id: incident.reportedBy },
        { projection: { name: 1, emergencyType: 1, vehicleNumber: 1 } }
      );
      incident.reportedByUser = user;
    }

    // Obtener información del usuario asignado
    if (incident.assignedTo) {
      const assignedUser = await db.collection('users').findOne(
        { _id: incident.assignedTo },
        { projection: { name: 1, emergencyType: 1, vehicleNumber: 1, currentLocation: 1 } }
      );
      incident.assignedToUser = assignedUser;
    }

    res.json(incident);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar estado de incidente
app.put('/api/incidents/:id', authenticateToken, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const { id } = req.params;

    if (!['active', 'in_progress', 'resolved', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (notes) updateData.notes = notes;
    if (status === 'resolved' || status === 'cancelled') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = new ObjectId(req.user.userId);
    }

    const result = await db.collection('incidents').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    res.json({ message: `Incidente actualizado a: ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Asignar incidente a vehículo
app.put('/api/incidents/:id/assign', authenticateToken, async (req, res) => {
  try {
    const { vehicleId } = req.body;
    const { id } = req.params;

    // Verificar que el vehículo existe
    const vehicle = await db.collection('users').findOne({ 
      _id: new ObjectId(vehicleId) 
    });

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' });
    }

    const result = await db.collection('incidents').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          assignedTo: new ObjectId(vehicleId),
          status: 'in_progress',
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    // Actualizar estado del vehículo
    await db.collection('users').updateOne(
      { _id: new ObjectId(vehicleId) },
      { 
        $set: { 
          currentStatus: 'busy',
          updatedAt: new Date()
        }
      }
    );

    res.json({ message: 'Incidente asignado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE RUTAS Y NAVEGACIÓN ==========

// POST - Calcular ruta óptima hacia un incidente
app.post('/api/routes/calculate', authenticateToken, async (req, res) => {
  try {
    const { incidentId, currentLat, currentLng, avoidTraffic = true } = req.body;
    const userId = req.user.userId;

    // Obtener detalles del incidente
    const incident = await db.collection('incidents').findOne({ 
      _id: new ObjectId(incidentId) 
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incidente no encontrado' });
    }

    // En una implementación real, aquí integrarías con Google Maps API, Mapbox, etc.
    // Por ahora, devolvemos una ruta simulada con datos realistas
    const distance = Math.random() * 20 + 1; // 1-21 km
    const duration = Math.random() * 30 + 5; // 5-35 minutos
    
    const simulatedRoute = {
      distance: `${distance.toFixed(1)} km`,
      duration: `${Math.round(duration)} minutos`,
      polyline: "simulated_polyline_data_here",
      steps: [
        "Diríjase al norte por Av. Principal",
        "Gire a la derecha en Calle Secundaria",
        "Continúe 2km hasta el destino",
        "Tome la salida hacia Calle Emergencia"
      ],
      trafficConditions: avoidTraffic ? "Tráfico ligero" : "Tráfico moderado",
      estimatedArrival: new Date(Date.now() + duration * 60000).toISOString()
    };

    // Registrar la asignación de ruta
    await db.collection('route_assignments').insertOne({
      userId: new ObjectId(userId),
      incidentId: new ObjectId(incidentId),
      startLocation: {
        type: "Point",
        coordinates: [parseFloat(currentLng), parseFloat(currentLat)]
      },
      endLocation: incident.location,
      route: simulatedRoute,
      assignedAt: new Date(),
      status: 'navigating'
    });

    // Actualizar el incidente como en progreso
    await db.collection('incidents').updateOne(
      { _id: new ObjectId(incidentId) },
      { 
        $set: { 
          assignedTo: new ObjectId(userId),
          status: 'in_progress',
          updatedAt: new Date()
        }
      }
    );

    // Actualizar estado del vehículo
    await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          currentStatus: 'busy',
          updatedAt: new Date()
        }
      }
    );

    res.json({
      message: 'Ruta calculada exitosamente',
      route: simulatedRoute,
      incident: {
        id: incident._id,
        type: incident.type,
        severity: incident.severity,
        location: incident.location,
        address: incident.address
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener historial de rutas de un vehículo
app.get('/api/routes/history', authenticateToken, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    const userId = req.user.userId;

    const routes = await db.collection('route_assignments')
      .find({ userId: new ObjectId(userId) })
      .sort({ assignedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .toArray();

    // Populate incident information
    const routesWithIncidents = await Promise.all(
      routes.map(async (route) => {
        if (route.incidentId) {
          const incident = await db.collection('incidents').findOne(
            { _id: route.incidentId },
            { projection: { type: 1, severity: 1, address: 1 } }
          );
          route.incident = incident;
        }
        return route;
      })
    );

    res.json(routesWithIncidents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== ENDPOINTS DE ESTADÍSTICAS Y REPORTES ==========

// GET - Estadísticas del sistema
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const [
      totalVehicles,
      activeVehicles,
      totalIncidents,
      activeIncidents,
      resolvedToday
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('users').countDocuments({ isActive: true }),
      db.collection('incidents').countDocuments(),
      db.collection('incidents').countDocuments({ status: 'active' }),
      db.collection('incidents').countDocuments({
        status: 'resolved',
        resolvedAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      })
    ]);

    // Estadísticas por tipo de emergencia
    const incidentsByType = await db.collection('incidents')
      .aggregate([
        { $group: { _id: "$type", count: { $sum: 1 } } }
      ])
      .toArray();

    // Vehículos por tipo
    const vehiclesByType = await db.collection('users')
      .aggregate([
        { $group: { _id: "$emergencyType", count: { $sum: 1 } } }
      ])
      .toArray();

    res.json({
      totalVehicles,
      activeVehicles,
      totalIncidents,
      activeIncidents,
      resolvedToday,
      incidentsByType,
      vehiclesByType
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Estadísticas de un vehículo específico
app.get('/api/stats/vehicle', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      totalAssigned,
      resolvedIncidents,
      avgResponseTime
    ] = await Promise.all([
      db.collection('route_assignments').countDocuments({ 
        userId: new ObjectId(userId) 
      }),
      db.collection('incidents').countDocuments({ 
        resolvedBy: new ObjectId(userId),
        resolvedAt: { $gte: thirtyDaysAgo }
      }),
      // Calcular tiempo promedio de respuesta (simulado)
      Promise.resolve(15.5) // En implementación real, calcularías esto
    ]);

    res.json({
      totalAssigned,
      resolvedIncidents,
      avgResponseTime: `${avgResponseTime} minutos`,
      performanceRating: Math.min(5, (resolvedIncidents / Math.max(1, totalAssigned)) * 5).toFixed(1)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== END ENDPOINTS ==========

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

// Manejo de errores global
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚑 Emergency Tracker Server running on http://localhost:${PORT}`);
  console.log(`📊 MongoDB connected: ${mongoUri ? 'Yes' : 'No'}`);
});