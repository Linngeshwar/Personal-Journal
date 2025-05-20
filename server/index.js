const express = require('express');
const app = express();
const cors = require('cors');
const { configDotenv } = require('dotenv');
configDotenv();
app.use(cors());
app.use(express.json());
const Authentication = require('./routes/auth');

app.use('/api/auth', Authentication);

app.listen(3000, () => {
  console.log('Backend server is running on http://localhost:3000');
});