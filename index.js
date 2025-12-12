const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const donationRoutes = require('./routes/donationRoutes');
const impactRoutes = require('./routes/impactRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api', require('./routes/impactRoutes'));
app.use('/api/impact', impactRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
