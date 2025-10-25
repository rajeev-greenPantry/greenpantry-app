const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004'],
  credentials: true
}));
app.use(express.json());

// No hardcoded data - using Cosmos DB instead
const restaurants = [];

// Routes
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Healthy', 
    timestamp: new Date().toISOString(),
    service: 'GreenPantry API'
  });
});

app.get('/api/restaurants', (req, res) => {
  try {
    console.log('📋 Restaurants requested');
    res.json(restaurants);
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/restaurants/:id', (req, res) => {
  try {
    const restaurant = restaurants.find(r => r.id === req.params.id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 GreenPantry API Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints:`);
  console.log(`   GET /health - Health check`);
  console.log(`   GET /api/restaurants - Get all restaurants`);
  console.log(`   GET /api/restaurants/:id - Get specific restaurant`);
});

