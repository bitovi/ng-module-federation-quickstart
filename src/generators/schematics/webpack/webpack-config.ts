import { IWebpackConfig } from '.';
import { webpackHostConfigTemplate } from './webpack-host.config';
import { webpackRemoteConfigTemplate } from './webpack-remote.config';

export function generateWebpackConfig(config: IWebpackConfig, isHost = false): string {
  if (isHost) {
    return webpackHostConfigTemplate.replace(/{{projectName}}/g, config.projectName.toString());
  }

  return webpackRemoteConfigTemplate.replace(/{{projectName}}/g, config.projectName.toString());
}
