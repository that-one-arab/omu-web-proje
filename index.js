require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());
// app.use(helmet());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const mainRoute = require('./routes');

app.use('/api', mainRoute);
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`App is listening on port ${PORT}`));
