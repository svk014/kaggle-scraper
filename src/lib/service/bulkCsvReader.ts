import fs, { ReadStream } from 'fs';
import readline from 'readline';
import { finished } from 'node:stream/promises';
import { parse } from 'fast-csv';
import { CsvSplitInfo } from '../model/csv-splitter';

export class BulkCsvReader {
  async *batchGenerator<TResult>(
    splitInfo: CsvSplitInfo,
  ): AsyncIterableIterator<{ items: TResult[]; filePath: string }> {
    const filePaths = await this.readFilePaths(splitInfo);

    for (const filePath of filePaths) {
      const promises: Promise<TResult>[] = [];

      const csvReadStream = fs
        .createReadStream(filePath)
        .pipe(parse({ headers: true }))
        .on('data', (row) => promises.push(Promise.resolve(row)))
        .on('end', async () => await Promise.all(promises));

      await finished(csvReadStream);
      const items = await Promise.all(promises);
      yield { items, filePath };
    }
  }

  private async readFilePaths(splitInfo: CsvSplitInfo): Promise<string[]> {
    const { indexFilePath, processedRegisterPath } = splitInfo;

    const indexReadStream = fs.createReadStream(indexFilePath);
    const filePaths = await this.streamToLines(indexReadStream);

    const processedReadStream = fs.createReadStream(processedRegisterPath);
    const processedFilePaths = await this.streamToLines(processedReadStream);
    const processedFilesMap = new Map(
      processedFilePaths.map((_path) => [_path, true]),
    );

    return filePaths.filter((_path) => !processedFilesMap.get(_path));
  }

  private async streamToLines(input: ReadStream): Promise<string[]> {
    const rlStream = readline.createInterface({ input });

    const lines: string[] = [];

    rlStream.on('line', (line) => {
      if (line == null || line.length === 0) {
        return;
      }
      lines.push(line);
    });

    await finished(input);
    return lines;
  }
}
