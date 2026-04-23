export default () => ({
  app: {
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: Number(process.env.PORT ?? 3000),
    mongodbUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017',
    mongodbDbName: process.env.MONGODB_DB_NAME ?? 'company_core_db',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET ?? 'change_me_access_secret',
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1d',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
  },
});

export function validateEnv(env: Record<string, unknown>) {
  const required = ['MONGODB_URI', 'MONGODB_DB_NAME', 'JWT_ACCESS_SECRET'];

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }

  return env;
}
