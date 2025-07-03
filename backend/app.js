require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 5000;
const app = express();
// const shopifyRoutes = require('./routes/shopifyRoutes');


app.use(express.json());

// app.use('/doctor', shopifyRoutes);


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
