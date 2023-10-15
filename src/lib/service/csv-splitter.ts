// import { CsvSplitOutput } from '../model/csv-splitter';
import { ConfigProvider } from '../config';
import * as fs from 'fs';
import { finished } from 'node:stream/promises';
import { Parse } from 'unzipper';
import { join } from 'path';

export class CsvSplitter {
  private readonly config: ConfigProvider;

  constructor(config: ConfigProvider) {
    this.config = config;
  }

  async unzipAndSplit(inputFilePath: string): Promise<void> {
    const fileNames = await this.unzipFile(inputFilePath);
  }

  private async unzipFile(inputFilePath: string): Promise<string[]> {
    const workingDirectory = this.config.workingDirectory;
    const fileNames: string[] = [];

    const zipReadStream = fs.createReadStream(inputFilePath);
    zipReadStream.pipe(Parse()).on('entry', function (entry) {
      if (entry.type === 'File') {
        const path = join(workingDirectory, entry.path);
        entry.pipe(fs.createWriteStream(path));
        fileNames.push(path);
      } else {
        entry.autodrain();
      }
    });

    await finished(zipReadStream);

    return fileNames;
  }
}
