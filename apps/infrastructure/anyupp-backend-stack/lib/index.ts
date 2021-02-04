import { CognitoStack } from './app/cognito-stack';
import { AppsyncAppStack } from './app/appsync-app-stack';
import { App } from '@serverless-stack/resources';

export default function main(app: App): void {
  new CognitoStack(app, 'cognito', {});
  //new SiteStack(app, 'sites');
  new AppsyncAppStack(app, 'appsync');
}
