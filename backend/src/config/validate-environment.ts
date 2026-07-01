type EnvironmentRecord = Record<string, string | undefined>;

const developmentDefaults: EnvironmentRecord = {
  NODE_ENV: 'development',
  PORT: '3000',
  MONGODB_DB_NAME: 'Auren',
  CORS_ORIGIN: 'http://localhost:4200'
};

const requiredAlways = ['MONGODB_URI'];
const requiredInProduction = ['JWT_SECRET', 'COOKIE_SECRET'];

export function validateEnvironment(rawConfig: EnvironmentRecord): EnvironmentRecord {
  const config = { ...developmentDefaults, ...rawConfig };
  const missing = requiredAlways.filter((key) => !config[key]);

  if (config.NODE_ENV === 'production') {
    missing.push(...requiredInProduction.filter((key) => !config[key]));
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  config.JWT_SECRET = config.JWT_SECRET || 'development-only-jwt-secret-change-me';
  config.COOKIE_SECRET = config.COOKIE_SECRET || 'development-only-cookie-secret-change-me';

  return config;
}

