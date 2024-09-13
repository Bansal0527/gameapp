const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Add this line
const authRoutes = require('./routes/auth');
const scoreRoutes = require('./routes/scores');
const connectDB = require("./config/db.js"); // Changed from import to require

require('dotenv').config(); // Load environment variables from .env file

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Add this line to use cookie-parser

connectDB()
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/number-guessing-game', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

const PORT = process.env.PORT || 8000;
console.log(process.env.MONGODB_URI )
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));