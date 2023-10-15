import { BulkCsvReader } from './bulkCsvReader';
import { NameCsvEntry } from '../model/csv';
import { Contact } from '../data/contact';
import { CsvSplitInfo } from '../model/csv-splitter';
import { HubspotService } from './hubspot';
import fs from 'fs';

const HUBSPOT_UPLOAD_BATCH_SIZE = 100;

export class ContactService {
  private hubspotService: HubspotService = new HubspotService();

  public async saveCsvToDb(splitInfo: CsvSplitInfo) {
    const csvReader = new BulkCsvReader();
    const batchIterator = csvReader.batchGenerator<NameCsvEntry>(splitInfo);

    const writeStream = fs.createWriteStream(splitInfo.processedRegisterPath, {
      flags: 'a',
    });

    for await (const batch of batchIterator) {
      await Contact.bulKCreateFromCsvEntries(batch.items);
      writeStream.write(batch.filePath);
      writeStream.write('\n');
    }

    writeStream.end();
  }

  async syncDbToHubspot() {
    console.info('Saving to Hubspot');
    let remaining = await Contact.countUnSynced();

    while (remaining > 0) {
      const unSynced = await Contact.findUnSynced(HUBSPOT_UPLOAD_BATCH_SIZE);
      await this.hubspotService.saveContactsInBulk(unSynced);
      await Contact.markSynced(unSynced);
      remaining = await Contact.countUnSynced();
    }
  }
}
