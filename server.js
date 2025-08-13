const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const IndexRoutes = require('./routes/index');
const deliveryActivityRoutes = require('./routes/deliveryActivity.routes');

const app = express(); // Initialize express app
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust for production
    methods: ["GET", "POST"],
  },
});

// --- CORS configuration ---
const corsOptions = {
  origin: 'http://localhost:4200', // Frontend URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Authorization,Content-Type',
  credentials: true,
};
app.use(cors(corsOptions));

// --- Static Files ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach `io` instance to `req` so it can be used in routes
app.use((req, res, next) => {
  req.app.io = io;
  next();
});

// --- API Routes ---
app.use('/api', IndexRoutes);
app.use('/api/delivery-activities', deliveryActivityRoutes);

// --- Socket.IO connection ---
io.on('connection', (socket) => {
  console.log('A client connected for live tracking');

  socket.on('custom-event', (data) => {
    console.log('Received data:', data);
    socket.broadcast.emit('update-event', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// --- MongoDB Connection ---
mongoose
  .connect('mongodb://localhost:27017/e-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
