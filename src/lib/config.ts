import * as dotenv from 'dotenv';

dotenv.config();

export class ConfigProvider {
  get kaggleUsername(): string {
    return this.retrieveOrCrash('KAGGLE_USER');
  }

  get kagglePassword(): string {
    return this.retrieveOrCrash('KAGGLE_PASSWORD');
  }

  get workingDirectory(): string {
    return this.retrieveOrCrash('WORK_DIRECTORY');
  }

  get hubspotAppToken(): string {
    return this.retrieveOrCrash('HUBSPOT_CONTACTS_CRM_TOKEN');
  }

  get dbUser(): string {
    return this.retrieveOrCrash('DATABASE_USER');
  }

  get dbPassword(): string {
    return this.retrieveOrCrash('DATABASE_PASSWORD');
  }

  get dbName(): string {
    return this.retrieveOrCrash('DATABASE_NAME');
  }

  get dbHost(): string {
    return this.retrieveOrCrash('DATABASE_HOST');
  }

  private retrieveOrCrash(envVar: string): string {
    const variable = process.env[envVar];
    if (!variable || variable.trim().length === 0) {
      throw new Error(`envVar ${envVar} not set!`);
    }
    return variable;
  }
}

export const configProvider = new ConfigProvider();
