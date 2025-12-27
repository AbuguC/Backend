require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/class');
const attendanceRoutes = require('./routes/attendance');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.get("/ping", (req, res) =>{
    res.json({message :"pong"})
});


app.use('/api/auth', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

