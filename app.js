const express = require("express")
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const socketIo = require('socket.io');







//basic test api
// app.get("/", ( req, res )=> {
    
//     console.log("inside test controller");

//     return res.status(200).json({
//         status : 200,
//         msg : "API is working"
//     });
// })

//routes configuration
app.use("/v1", require("./routes"))


// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const deliveryRoutes = require('./routes/delivery'); // New delivery route
// Load environment variables
dotenv.config();

// Initialize Socket.io
const server = require('http').createServer(app);
const io = socketIo(server);  // Initialize Socket.io on the server

// Attach Socket.io to app (so it can be used across routes)
app.io = io;

// Body parser middleware to handle incoming JSON
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, (err)=>{
    if( err )
    {
        console.log("Error running on server ", err );
    }
    else{
        console.log(` Server is running on port ${ port }` );
    }
})


// Handle live location updates from delivery partners
io.on('connection', (socket) => {
    console.log('A user connected to live delivery tracking');
  
    // Listen for delivery updates
    socket.on('update-location', (data) => {
      console.log('Delivery update received:', data);
      // Broadcast to the delivery coordinator (or a specific group)
      io.emit('delivery-updated', data);  // Broadcast to everyone (you can filter specific rooms if needed)
    });
  
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  