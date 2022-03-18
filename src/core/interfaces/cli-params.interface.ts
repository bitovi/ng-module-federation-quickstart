export interface ICliParams {
  init?: boolean;
  projectName?: string;
  style?: string;
  remote?: string;

  serveAll?: boolean;
  serve?: string;

  buildAll?: boolean;
  build?: string;

  addRemoteModule?: string;
}
