const serverless = require('serverless-http');
const express = require('express');
const { validateLead } = require('./db/validators');
const { dbClient } = require('./db/clients');
const { newLead, listLead, getLead } = require('./db/crud');

const app = express();
app.use(express.json());

const STAGE = process.env.STAGE || 'prod';

app.get('/', async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await dbClient();
  const now = Date.now();
  const [result] = await sql`select now();`;
  const delta = result.now.getTime() - now;

  return res.status(200).json({
    result: result.now,
    delta,
    stage: STAGE,
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
  const rawBody = await req.body;
  const { data, hasError, message } = await validateLead(rawBody);
  if (hasError) {
    return res.status(400).json({
      message: message ? message : 'Invalidate request. Please try agin',
    });
  }
  if (hasError === undefined) {
    return res.status(500).json({
      message: 'Server Error',
    });
  }
  const result = await newLead(data);

  return res.status(201).json({
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
