const express = require('express');
const app = express();

// API Routes
require('./routes/')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build/static'));

  const path = require('path');

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);