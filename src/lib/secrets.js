const { SSMClient, GetParameterCommand, PutParameterCommand } = require('@aws-sdk/client-ssm');
const AWS_REGION = 'us-east-2';
const STAGE = process.env.STAGE || 'prod';

const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`;

module.exports.getDatabaseUrl = async () => {
  try {
    const client = new SSMClient({ region: AWS_REGION });
    const paramStoreDate = {
      Name: DATABASE_URL_SSM_PARAM,
      WithDecryption: true,
    };
    const command = new GetParameterCommand(paramStoreDate);
    const response = await client.send(command);

    return response.Parameter.Value;
  } catch (e) {
    console.log(e);
  }
};

module.exports.purDatabaseUrl = async (stage = 'dev', dbUrlVal) => {
  try {
    const paramStage = stage;
    if (paramStage === 'prod') {
      return;
    }

    console.log(stage, dbUrlVal);

    const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${paramStage}/database-url`;
    const client = new SSMClient({ region: AWS_REGION });

    const paramStoreDate = {
      Name: DATABASE_URL_SSM_PARAM,
      Value: dbUrlVal,
      Type: 'SecureString',
      Overwrite: true,
    };

    const command = new PutParameterCommand(paramStoreDate);
    const response = await client.send(command);

    return response;
  } catch (e) {
    console.log(e);
  }
};
