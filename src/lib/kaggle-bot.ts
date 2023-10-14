import { chromium, Page } from 'playwright';
import { ConfigProvider } from '../lib/config';
import { StoreFileResponse } from '../lib/model/kaggle-bot';
import path from 'path';

export class KaggleBot {
  private readonly config: ConfigProvider;

  constructor(config: ConfigProvider) {
    this.config = config;
  }

  public async storeFile(): Promise<StoreFileResponse> {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await this.performSignIn(page);
    const response = await this.downloadAndSaveToPath(page);
    await page.close();
    return response;
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

  private async downloadAndSaveToPath(page: Page): Promise<StoreFileResponse> {
    await page.goto(
      'https://www.kaggle.com/datasets/thedevastator/us-baby-names-by-year-of-birth?select=babyNamesUSYOB-full.csv',
    );
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: 'get_app' }).click();
    const download = await downloadPromise;

    const filePath = path.join(
      this.config.workingDirectory,
      download.suggestedFilename(),
    );
    await download.saveAs(filePath);
    return { filePath };
  }
}
