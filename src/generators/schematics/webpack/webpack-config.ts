import { IWebpackConfig } from '.';
import { getAllNameConventions, INameConventions } from '../../../core';
import { webpackSampleConfigTemplate } from './webpack-sample.config';

export function generateWebpackConfig(config: IWebpackConfig): string {
  const projectNames: INameConventions = getAllNameConventions(config.projectName);

  return webpackSampleConfigTemplate.replace(/\{\{projectNameVariable\}\}/g, projectNames.camel);
}
