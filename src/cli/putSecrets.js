// github action
// tsx src/cli/putSecrets.js <stage> <dbUrl>
require('dotenv').config();
const secrets = require('../lib/secrets');

(async () => {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log('Usage: tsx src/cli/putSecrets.js <stage> <dbUrl>');
    process.exit(1);
  }

  if (require.main === module) {
    console.log('Update secret!');
    const [stage, dbUrl] = args;
    console.log(stage, dbUrl);
    try {
      const result = await secrets.purDatabaseUrl(stage, dbUrl);
      console.log(result);
      console.log('Secret is set on SSM');
      process.exit(0);
    } catch (e) {
      console.log(e);
      process.exit(1);
    }
  }
})();
