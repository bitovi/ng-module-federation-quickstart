export interface IBitoviConfig {
  version: string;
  apps: { [projectName: string]: IApp };
  host: string;
}

export interface IApp {
  path: string;
  port: number;
}
