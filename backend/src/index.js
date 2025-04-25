const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const requestRoutes = require('./routes/requestRoutes');
const userRoutes = require('./routes/userRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const port = 4000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// API routes
app.get('/api', (req, res) => {
  res.json({
    message: 'Telegram WebApp Backend API',
    status: 'running',
    endpoints: {
      requests: '/api/requests'
    }
  });
});

app.post('/api/requests', (req, res) => {
  console.log('Received request data:', req.body);
  res.json({ success: true, data: req.body });
});

app.use('/api', requestRoutes);
app.use('/api', userRoutes);
app.use('/api', exportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 