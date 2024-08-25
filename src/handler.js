const serverless = require('serverless-http');
const express = require('express');
const { dbClient } = require('./db/clients');
const { newLead, listLead, getLead } = require('./db/crud');

const app = express();
app.use(express.json());

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

app.get('/leads', async (req, res, next) => {
  const results = await listLead();

  return res.status(200).json({
    results,
  });
});

app.get('/leads/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await getLead({ id });

  return res.status(200).json({
    results: result,
  });
});

app.post('/leads', async (req, res, next) => {
  const { email } = await req.body;
  console.log(req.body);
  const result = await newLead({ email });

  return res.status(200).json({
    results: result,
  });
});

app.delete('/leads/:id', async (req, res, next) => {
  const { id } = req.params;
  const result = await deleteLead({ id });

  return res.status(200).json({
    results: result,
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
