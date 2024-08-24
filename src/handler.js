const serverless = require('serverless-http');
const express = require('express');
const app = express();

app.get('/', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from root!',
    DEBUG: process.env.DEBUG,
    DATABASE_URL: process.env.DATABASE_URL,
  });
});

app.get('/hello', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello from path!',
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

exports.handler = serverless(app);

// server-full app
// app.listen(3400, () => {
//   console.log('Application is listen on port 3400');
// });
