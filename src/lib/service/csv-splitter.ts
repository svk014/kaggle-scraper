import { CsvSplitInfo } from '../model/csv-splitter';
import { configProvider, ConfigProvider } from '../config';
import * as fs from 'fs';
import { finished } from 'node:stream/promises';
import { Parse } from 'unzipper';
import { join } from 'path';
import { createHash } from 'crypto';
import * as readline from 'readline';

const MAX_ROWS_PER_FILE = 1000;

export class CsvSplitter {
  private readonly config: ConfigProvider = configProvider;

  private info(inputFilePath: string): CsvSplitInfo {
    return new CsvSplitInfo(
      join(this.config.workingDirectory, this.hashString(inputFilePath)),
      '_index.txt',
      '_processed.txt',
    );
  }

  private hashString(inputFilePath: string) {
    return createHash('md5').update(inputFilePath).digest('hex');
  }

  async unzipAndSplit(
    inputFilePath: string,
    options: {
      skipIfExists: boolean;
    },
  ): Promise<CsvSplitInfo> {
    const splitInfo = this.info(inputFilePath);
    const indexFileExists = fs.existsSync(splitInfo.indexFilePath);

    if (options.skipIfExists && indexFileExists) {
      console.log('Already unzipped. Skipping unzip and split step.');
      return splitInfo;
    }

    const fileNames = await this.unzipFile(inputFilePath);
    await this.splitFiles(fileNames, splitInfo);
    return splitInfo;
  }

  private async splitFiles(fileNames: string[], splitInfo: CsvSplitInfo) {
    if (!fs.existsSync(splitInfo.splitFilesDir)) {
      fs.mkdirSync(splitInfo.splitFilesDir);
    }
    const indexWriteStream = fs.createWriteStream(splitInfo.indexFilePath);
    fs.closeSync(fs.openSync(splitInfo.processedRegisterPath, 'w'));

    for (const fileName of fileNames) {
      const splitFiles = await this.splitFile(fileName, splitInfo);
      indexWriteStream.write(splitFiles.join('\n'));
      indexWriteStream.write('\n');
    }
    indexWriteStream.end();
  }

  private async splitFile(
    fileName: string,
    splitInfo: CsvSplitInfo,
  ): Promise<string[]> {
    const readStream = fs.createReadStream(fileName);

    const filePrefix = this.hashString(fileName);

    const rlStream = readline.createInterface({
      input: readStream,
    });

    let lineIndex = 0;
    let fileIndex = 1;
    let header: string | null = null;
    let lines: string[] = [];
    const splitFiles: string[] = [];

    rlStream.on('line', (line) => {
      if (lineIndex == 0) {
        header = line;
        lineIndex++;
        return;
      }
      lines.push(line);

      if (lines.length == MAX_ROWS_PER_FILE) {
        splitFiles.push(
          this.flushToFile(filePrefix, fileIndex, header, lines, splitInfo),
        );

        lines = [];
        fileIndex++;
      }
      lineIndex++;
    });

    if (lines.length > 0) {
      splitFiles.push(
        this.flushToFile(filePrefix, fileIndex, header, lines, splitInfo),
      );
    }

    await finished(readStream);
    return splitFiles;
  }

  private flushToFile(
    filePrefix: string,
    currentFile: number,
    header: string | null,
    lines: string[],
    splitInfo: CsvSplitInfo,
  ): string {
    const currentFilePath = join(
      splitInfo.splitFilesDir,
      `${filePrefix}-${currentFile}.csv`,
    );
    const writeStream = fs.createWriteStream(currentFilePath);

    if (header) {
      writeStream.write(header);
      writeStream.write('\n');
    }

    writeStream.write(lines.join('\n'));
    writeStream.end();

    return currentFilePath;
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
