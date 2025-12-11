require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'case_study',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    schema: 'public',
    logging: console.log,
    define: {
      schema: 'public',
    },
    dialectOptions: {
      prependSearchPath: true,
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    schema: 'public',
    logging: false,
    define: {
      schema: 'public',
    },
    dialectOptions: {
      prependSearchPath: true,
    },
  },
};

