import { defineConfig } from 'drizzle-kit';

const config = defineConfig({
  schema: './src/db/schemas.js',
  out: './src/migrations',
  dialect: 'postgresql', // 'postgresql' | 'mysql' | 'sqlite'
});

export default config;
