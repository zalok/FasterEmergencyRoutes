const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const mongoUri = process.env.MONGO_DB;

const client = new MongoClient(mongoUri);

client.connect()
  .then(() => console.log('Connected to MongoDB 🎉'))
  .catch(err => console.error('MongoDB connection error:', err));


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
}
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
