import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';
import { CsvSplitter } from '../service/csv-splitter';
import { Contact } from '../data/contact';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    await bot.downloadUsBabyNames({ skipIfExists: true });

    const csvSplitter = new CsvSplitter(configProvider);
    await csvSplitter.unzipAndSplit(bot.downloadFilePath, {
      skipIfExists: true,
    });

    await Contact.bulKCreateIgnoreDuplicates([
      { firstname: 'Souvik', gender: 'M' },
      { firstname: 'Souvik', gender: 'M' },
    ]);
  }
}
