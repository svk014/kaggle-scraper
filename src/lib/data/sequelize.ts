import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('kaggle_data', 'test_user', 'password', {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});
