# 🧰 Kaggle Scraper

### Description
This repository contains `typescript` code. Following is a step-by-step guide of tasks performed by the code,

1. Csv file is scraped from `kaggle.com` using `playwright`.
2. Since, the downloaded csv is large. The csv is split into multiple csv files, each containing 1000 lines.
3. Each split csv is individually read, and stored into a `mysql` database using `sequelize` orm.
4. For each split csv, all 1000 entries in the file is stored into the database using a single bulk create operation.
5. Once all split csv files are stored in the database, the DB entries are read (100 entries at a time), uploaded to `Hubspot` in bulk, and marked as synced.

#### Design details and considerations
- Code is organised into services, controllers, and models.
- Progress from each step is continuously saved, therefore the code can resume from last state in case of errors.
- The input csv is split into multiple files, so that, if needed, multiple worker-threads can process csv files in parallel.
- At a time, only 100 contacts are read and synced to Hubspot as Hubspot has a batch limit of 100 contacts.
- Contacts upload to Hubspot are marked as synced in the DB. This makes the system resilient to duplication on failures.

### TODO
- Add unit tests

### Scripts

#### `mysql.server start`

Starts the local `mysql` server, required for local development.

#### `npm run start:dev`

Starts the application in development using `nodemon` and `ts-node` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Run the `jest` tests in watch mode, waiting for file changes.

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.
