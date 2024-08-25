const serverless = require('serverless-http');
const express = require('express');
const { dbClient } = require('./db/clients');

const app = express();

app.get('/', async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await dbClient();
  const now = Date.now();
  const [result] = await sql`select now();`;
  const delta = result.now.getTime() - now;
  return res.status(200).json({
    message: 'Hello from root!',
    result: result.now,
    delta,
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
