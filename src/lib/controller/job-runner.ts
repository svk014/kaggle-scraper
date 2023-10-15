import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';
import { CsvSplitter } from '../service/csv-splitter';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    if (!bot.isFileDownloaded) {
      await bot.downloadUsBabyNames();
    }

    await new CsvSplitter(configProvider).unzipAndSplit(bot.downloadFilePath);
  }
}
