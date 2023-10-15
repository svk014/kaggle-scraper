import { sequelize } from './sequelize';
import { DataTypes, Model } from 'sequelize';
import { NameCsvEntry } from '../model/csv';
import { DbContact } from '../model/db';

export class Contact extends Model {
  static async bulKCreateFromCsvEntries(csvContacts: NameCsvEntry[]) {
    const contacts: Partial<DbContact>[] = csvContacts.map((contact) => ({
      firstname: contact.Name,
      gender: contact.Sex,
    }));
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
