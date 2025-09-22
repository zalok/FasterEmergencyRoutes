const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ObjectId } = require('mongodb');

dotenv.config();

const mongoUri = process.env.MONGO_DB;
const client = new MongoClient(mongoUri);

// Conectar a MongoDB
let db;
client.connect()
  .then(() => {
    console.log('Connected to MongoDB 🎉');
    db = client.db(); // Usa la base de datos por defecto o especifica una: client.db('nombre_db')
  })
  .catch(err => console.error('MongoDB connection error:', err));

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// ========== ENDPOINTS CRUD ==========

// GET - Obtener todos los items
app.get('/api/items', async (req, res) => {
  try {
    const items = await db.collection('items').find().toArray();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET - Obtener un item por ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const item = await db.collection('items').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST - Crear un nuevo item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    // Validación básica
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required' });
    }
    
    const result = await db.collection('items').insertOne({
      name,
      description: description || '',
      price: parseFloat(price),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    res.status(201).json({
      message: 'Item created successfully',
      id: result.insertedId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT - Actualizar un item existente
app.put('/api/items/:id', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { 
        $set: { 
          ...(name && { name }),
          ...(description && { description }),
          ...(price && { price: parseFloat(price) }),
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Eliminar un item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const result = await db.collection('items').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ========== END ENDPOINTS ==========

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});