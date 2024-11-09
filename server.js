const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const deliveryActivityRoutes = require('./routes/deliveryActivity');
const app = express();

const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use((req, res, next) => {
  req.app.io = io;
  next();
});

app.use('/api/delivery-activities', deliveryActivityRoutes);

io.on('connection', (socket) => {
  console.log('A client connected for live tracking');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect('mongodb://localhost:27017/yourdbname', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => server.listen(3000, () => console.log('Server running on port 3000')))
  .catch((error) => console.error('Database connection error:', error));
 