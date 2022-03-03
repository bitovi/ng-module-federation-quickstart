import { ConsoleColor } from '../enums';

export const log = {
  color: (color: ConsoleColor, message: string): void => {
    console.log(`${color}%s${ConsoleColor.Reset}`, message);
  },
  success: (message: string): void => {
    console.log(
      `${ConsoleColor.FgGreen}%s${ConsoleColor.Reset}`,
      `${logSymbols.success} ${message}`
    );
  },
  error: (message: string): void => {
    console.log(`${ConsoleColor.FgRed}%s${ConsoleColor.Reset}`, `${logSymbols.error} ${message}`);
  },
  info: (message: string): void => {
    console.log(`${ConsoleColor.FgBlue}%s${ConsoleColor.Reset}`, `${logSymbols.info} ${message}`);
  },
};

function isUnicodeSupported(): boolean {
  if (process.platform !== 'win32') {
    return process.env.TERM !== 'linux'; // Linux console (kernel)
  }

  return (
    Boolean(process.env.CI) ||
    Boolean(process.env.WT_SESSION) || // Windows Terminal
    process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
    process.env.TERM_PROGRAM === 'vscode' ||
    process.env.TERM === 'xterm-256color' ||
    process.env.TERM === 'alacritty'
  );
}

const main = {
  info: 'ℹ',
  success: '✔',
  warning: '⚠',
  error: '✖',
};

const fallback = {
  info: 'i',
  success: '√',
  warning: '‼',
  error: '×',
};

const logSymbols = isUnicodeSupported() ? main : fallback;
