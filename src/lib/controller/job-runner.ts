import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';
import { CsvSplitter } from '../service/csv-splitter';
import { Contact } from '../data/contact';
import { BulkCsvReader } from '../service/bulkCsvReader';
import { NameCsvEntry } from '../model/csv';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    await bot.downloadUsBabyNames({ skipIfExists: true });

    const csvSplitter = new CsvSplitter();
    const splitInfo = await csvSplitter.unzipAndSplit(bot.downloadFilePath, {
      skipIfExists: true,
    });

    const csvReader = new BulkCsvReader();
    const batchIterator = csvReader.batchGenerator<NameCsvEntry>(
      splitInfo.indexFilePath,
    );

    for await (const batch of batchIterator) {
      await Contact.bulKCreateFromCsvEntries(batch);
    }
  }
}
