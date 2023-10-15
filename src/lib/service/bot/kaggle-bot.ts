import { chromium, Page } from 'playwright';
import { ConfigProvider } from '../../config';
import path from 'path';
import * as fs from 'fs';

export class KaggleBot {
  private readonly config: ConfigProvider;

  private outputFilename = 'babyNamesUSYOB-full.csv.zip';

  constructor(config: ConfigProvider) {
    this.config = config;
  }

  public get isFileDownloaded() {
    return fs.existsSync(this.downloadFilePath);
  }

  public get downloadFilePath() {
    return path.join(this.config.workingDirectory, this.outputFilename);
  }

  public async downloadUsBabyNames(options: {
    skipIfExists: boolean;
  }): Promise<void> {
    if (options.skipIfExists && this.isFileDownloaded) {
      console.info('Already downloaded. Skipping download.');
      return;
    }
    console.info('Downloading csv from Kaggle');

    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await this.performSignIn(page);
    await this.downloadAndSaveToPath(page);

    await page.close();
    await browser.close();
  }

  private async performSignIn(page: Page) {
    await page.goto('https://www.kaggle.com/account/login');
    await page.getByText('Sign in with Email').click();

    await page
      .getByLabel('Email / Username', { exact: true })
      .fill(this.config.kaggleUsername);
    await page
      .getByLabel('Password', { exact: true })
      .fill(this.config.kagglePassword);

    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.waitForURL('https://www.kaggle.com/');
  }

  private async downloadAndSaveToPath(page: Page): Promise<void> {
    await page.goto(
      'https://www.kaggle.com/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv',
    );
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'get_app' }).click();
    const download = await downloadPromise;

    await download.saveAs(this.downloadFilePath);
  }
}
