import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    if (!bot.downloadedFileExists) {
      await bot.downloadUsBabyNames();
    }
  }
}
