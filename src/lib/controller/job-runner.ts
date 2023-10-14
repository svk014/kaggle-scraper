import { KaggleBot } from '../kaggle-bot';
import { configProvider } from '../config';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    await bot.storeFile();
  }
}
