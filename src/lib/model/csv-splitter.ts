import { join } from 'path';

export class CsvSplitInfo {
  splitFilesDir: string;
  indexFile: string;

  constructor(splitFilesDir: string, indexFile: string) {
    this.splitFilesDir = splitFilesDir;
    this.indexFile = indexFile;
  }

  get indexFilePath(): string {
    return join(this.splitFilesDir, this.indexFile);
  }
}
