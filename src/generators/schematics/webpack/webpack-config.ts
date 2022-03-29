import { IWebpackConfig } from '.';
import { getAllNameConventions, INameConventions } from '../../../core';
import { webpackHostConfigTemplate } from './webpack-host.config';
import { webpackRemoteConfigTemplate } from './webpack-remote.config';

export function generateWebpackConfig(config: IWebpackConfig, isHost = false): string {
  const projectNames: INameConventions = getAllNameConventions(config.projectName);

  let webpackConfigTemplate = webpackRemoteConfigTemplate;

  if (isHost) {
    webpackConfigTemplate = webpackHostConfigTemplate;
  }

  return webpackConfigTemplate
    .replace(/\{\{projectName\}\}/g, config.projectName)
    .replace(/\{\{projectNameVariable\}\}/g, projectNames.camel);
}
