const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./controller/userRoutes.js');
const connectDB = require('./config/db.js');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/user', userRoutes);

app.listen(5000, () => { console.log("Backend Started at port", 5000) })