import { JobRunner } from './lib/controller/job-runner';

async function main() {
  await new JobRunner().runKaggleSyncJob();
}

main().then(() => {
  // eslint-disable-next-line no-console
  console.log('All jobs completed successfully!');
});

process.stdin.resume();
