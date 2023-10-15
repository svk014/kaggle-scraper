import { BulkCsvReader } from './bulkCsvReader';
import { NameCsvEntry } from '../model/csv';
import { Contact } from '../data/contact';
import { CsvSplitInfo } from '../model/csv-splitter';
import { HubspotService } from './hubspot';

const HUBSPOT_UPLOAD_BATCH_SIZE = 100;

export class ContactService {
  private hubspotService: HubspotService = new HubspotService();

  public async saveCsvToDb(splitInfo: CsvSplitInfo) {
    const csvReader = new BulkCsvReader();
    const batchIterator = csvReader.batchGenerator<NameCsvEntry>(
      splitInfo.indexFilePath,
    );

    for await (const batch of batchIterator) {
      await Contact.bulKCreateFromCsvEntries(batch);
    }
  }

  async syncDbToHubspot() {
    let remaining = await Contact.countUnSynced();

    while (remaining > 0) {
      const unSynced = await Contact.findUnSynced(HUBSPOT_UPLOAD_BATCH_SIZE);
      await this.hubspotService.saveContactsInBulk(unSynced);
      await Contact.markSynced(unSynced);
      remaining = await Contact.countUnSynced();
    }
  }
}
