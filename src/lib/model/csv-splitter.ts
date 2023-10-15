import { join } from 'path';

export class CsvSplitInfo {
  splitFilesDir: string;
  indexFile: string;
  processedRegisterFile: string;

  constructor(
    splitFilesDir: string,
    indexFile: string,
    processedRegisterFile: string,
  ) {
    this.splitFilesDir = splitFilesDir;
    this.indexFile = indexFile;
    this.processedRegisterFile = processedRegisterFile;
  }

  get indexFilePath(): string {
    return join(this.splitFilesDir, this.indexFile);
  }
  get processedRegisterPath(): string {
    return join(this.splitFilesDir, this.processedRegisterFile);
  }
}
