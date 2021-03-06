const express = require('express');
const app = express();

// API Routes
require('./routes/')(app);

if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const compression = require('compression');
  
  app.use(compression());
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);