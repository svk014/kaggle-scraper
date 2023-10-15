import { configProvider, ConfigProvider } from '../config';
import { Client } from '@hubspot/api-client';
import { DbContact } from '../model/db';

export class HubspotService {
  private readonly config: ConfigProvider = configProvider;

  public async saveContactsInBulk(dbContacts: DbContact[]) {
    const hubspotClient = new Client({
      accessToken: this.config.hubspotAppToken,
    });

    const inputs = dbContacts.map((contact) => ({
      properties: { firstname: contact.firstname, gender: contact.gender },
      associations: [],
    }));

    await hubspotClient.crm.contacts.batchApi.create({ inputs });
  }
}
