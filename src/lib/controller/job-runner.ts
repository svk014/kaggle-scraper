import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';
import { CsvSplitter } from '../service/csv-splitter';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    await bot.downloadUsBabyNames({ skipIfExists: true });

    const csvSplitter = new CsvSplitter(configProvider);
    await csvSplitter.unzipAndSplit(bot.downloadFilePath, {
      skipIfExists: true,
    });
  }
}
