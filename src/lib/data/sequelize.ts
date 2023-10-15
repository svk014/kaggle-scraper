import { Sequelize } from 'sequelize';
import { configProvider } from '../config';

const { dbName, dbUser, dbPassword, dbHost } = configProvider;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: 'mysql',
  logging: false,
});
