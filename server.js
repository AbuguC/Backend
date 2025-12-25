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
app.get("/", (req, res) =>{
    res.send("Server is running ")
});


app.use('/api/auth', authRoutes);
app.use('/api/class', classRoutes);
app.use('/api/attendance', attendanceRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

