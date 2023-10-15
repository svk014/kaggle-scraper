import { KaggleBot } from '../bot/kaggle-bot';
import { configProvider } from '../config';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    // await bot.downloadUsBabyNames();
  }
}
