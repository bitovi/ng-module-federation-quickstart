import { createWriteStream } from 'fs';
import gitignore from 'gitignore';
import { promisify } from 'util';
import { join } from 'path';

const writeGitignore = promisify(gitignore.writeFile);

export async function createGitignore(targetDirectory) {
  const file = createWriteStream(join(targetDirectory, '.gitignore'), {
    flags: 'a',
  });
  writeGitignore({
    type: 'Node',
    file: file,
  });
}
