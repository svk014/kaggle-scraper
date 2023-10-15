import { ConfigProvider } from '../config';
import { Client } from '@hubspot/api-client';
import { SavedContact } from '../model/db';

export class HubspotService {
  private readonly config: ConfigProvider;

  constructor(config: ConfigProvider) {
    this.config = config;
  }

  public async saveContactsInBulk(dbContacts: SavedContact[]) {
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
