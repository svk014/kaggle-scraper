# 🧰 Kaggle Scraper

### TODO
- ~~basic setup~~
- ~~test downloads~~
- ~~Splt files~~
- ~~scan file in batches and save progress in DB~~
- ~~update DB with sequelize ORM~~
- ~~add data to hubspot~~
- ~~add workflow management if possible~~
- ~~read from DB and push to hubspot and mark as done~~
- ~~skip already processed csv-splits~~
- write documentation
- fix missed csv entries bug

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
