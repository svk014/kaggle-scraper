import { JobRunner } from './lib/controller/job-runner';
import { sequelize } from './lib/data/sequelize';
import { Contact } from './lib/data/contact';

async function initDB() {
  await sequelize.authenticate();
  await Contact.sync();
}

async function main() {
  await initDB();
  await new JobRunner().runKaggleSyncJob();
}

main().then(() => {
  // eslint-disable-next-line no-console
  console.log('All jobs completed successfully!');
  process.exit(0);
});

process.stdin.resume();
