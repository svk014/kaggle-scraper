import { KaggleBot } from '../service/bot/kaggle-bot';
import { configProvider } from '../config';
import { CsvSplitter } from '../service/csv-splitter';
import { ContactService } from '../service/contact';

export class JobRunner {
  async runKaggleSyncJob() {
    const bot = new KaggleBot(configProvider);
    await bot.downloadUsBabyNames({ skipIfExists: true });

    const csvSplitter = new CsvSplitter();
    const splitInfo = await csvSplitter.unzipAndSplit(bot.downloadFilePath, {
      skipIfExists: true,
    });

    const contactService = new ContactService();
    await contactService.saveCsvToDb(splitInfo);
    await contactService.syncDbToHubspot();
  }
}
