import { ConsoleColor, log } from '../../../core';
import { existsSync } from 'fs';
import { join } from 'path';

export function checkBiConfig(): void {
  const isProjectStarted: boolean = existsSync(join(process.cwd(), 'bi.json'));

  if (isProjectStarted) {
    log.color(ConsoleColor.FgRed, '--------------------------------');
    log.color(ConsoleColor.FgCyan, 'Already exists a bitovi project ');
    log.color(ConsoleColor.FgRed, '--------------------------------');

    process.exit(1);
  }

  log.color(ConsoleColor.FgGreen, 'Creating config');
}
