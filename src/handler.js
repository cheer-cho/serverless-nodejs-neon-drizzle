const serverless = require('serverless-http');
const express = require('express');
const AWS = require('aws-sdk');

const { neon, neonConfig } = require('@neondatabase/serverless');

const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';

const app = express();
const SSM = new AWS.SSM({ region: AWS_REGION });

const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

async function dbClient() {
  try {
    // for http connections
    // non-pooling
    const paramStoreDate = await SSM.getParameter({
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    }).promise();

    neonConfig.fetchConnectionCache = true;
    const sql = neon(paramStoreDate.Parameter.Value);
    return sql;
  } catch (e) {
    console.log(e);
  }
}

app.get('/', async (req, res, next) => {
  console.log(process.env.DEBUG);
  const sql = await dbClient();
  const [result] = await sql`select now();`;
  return res.status(200).json({
    message: 'Hello from root!',
    result: result.now,
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
