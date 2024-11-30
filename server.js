const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const IndexRoutes = require('./routes/index');

const app = express(); // Initialize express app

const cors = require('cors');
// CORS configuration
const corsOptions = {
  origin: 'http://localhost:4200', // Replace with your frontend's URL
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Authorization,Content-Type',
  credentials: true, // Allow credentials (cookies, etc.)
};

app.use(cors(corsOptions));


const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow requests from any origin (adjust for production)
    methods: ["GET", "POST"],
  },
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach `io` instance to `req` for use in routes
const deliveryActivityRoutes = require('./routes/deliveryActivity');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use((req, res, next) => {
  req.app.io = io;
  next();
});



// Define the API route
app.use('/api', IndexRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A client connected for live tracking');

  // Event handling (if needed)
  socket.on('custom-event', (data) => {
    console.log('Received data:', data);
    // You can broadcast or emit messages to other clients
    socket.broadcast.emit('update-event', data);
  });

  // Handle client disconnection
app.use('/api/delivery-activities', deliveryActivityRoutes);

io.on('connection', (socket) => {
  console.log('A client connected for live tracking');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Database connection
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
    process.exit(1); // Exit the process if database connection fails
  });
mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen(3000, () => console.log('Server running on port 3000')))
  .catch((error) => console.error('Database connection error:', error));
 
