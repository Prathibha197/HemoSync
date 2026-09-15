require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { init } = require('./utils/socket');
require('./services/cronService');

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = init(server);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/donor', require('./routes/donorRoutes'));
app.use('/api/hospital', require('./routes/hospitalRoutes'));
app.use('/api/bloodbank', require('./routes/bloodbankRoutes'));

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
