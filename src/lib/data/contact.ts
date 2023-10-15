import { sequelize } from './sequelize';
import { DataTypes, Model } from 'sequelize';
import { SavedContact } from '../model/db';

export class Contact extends Model {
  static async bulKCreateIgnoreDuplicates(contacts: Partial<SavedContact>[]) {
    await Contact.bulkCreate(contacts, { ignoreDuplicates: true });
  }
}

Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeUniqueNameIndex',
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeUniqueNameIndex',
    },
    syncedToCrm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'contacts',
  },
);
