import fs from 'fs';
import readline from 'readline';
import { finished } from 'node:stream/promises';
import { parse } from 'fast-csv';

export class BulkCsvReader {
  async *batchGenerator<TResult>(
    indexFilePath: string,
  ): AsyncIterableIterator<TResult[]> {
    const filePaths = await this.readFilePaths(indexFilePath);

    for (const filePath of filePaths) {
      const promises: Promise<TResult>[] = [];

      const csvReadStream = fs
        .createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('data', (row) => promises.push(Promise.resolve(row)))
        .on('end', async () => await Promise.all(promises));

      await finished(csvReadStream);
      yield await Promise.all(promises);
    }
  }

  private async readFilePaths(indexFilePath: string) {
    const indexReadStream = fs.createReadStream(indexFilePath);
    const rlStream = readline.createInterface({
      input: indexReadStream,
    });

    const filePaths: string[] = [];

    rlStream.on('line', (line) => {
      if (line == null || line.length === 0) {
        return;
      }
      filePaths.push(line);
    });
    await finished(indexReadStream);
    return filePaths;
  }
}
