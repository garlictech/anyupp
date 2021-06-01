import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import path from 'path';
import { PROJECT_ROOT } from './settings';
import { getFQParamName } from './utils';
import { WebsiteConstruct } from './website-construct';

export interface SiteStackProps extends sst.StackProps {
  certificateArn: string;
}

export class SiteStack extends sst.Stack {
  public adminSiteUrl: string;

  constructor(scope: sst.App, id: string, props: SiteStackProps) {
    super(scope, id, props);
    const app = this.node.root as sst.App;

    const adminSite = new WebsiteConstruct(this, 'Admin', {
      domainName: 'anyupp.com',
      siteSubDomain: app.stage === 'prod' ? 'admin' : 'admin-' + app.name,
      distDir: path.join(PROJECT_ROOT, '/dist/apps/admin'),
      certificateArn: props.certificateArn,
    });

    this.adminSiteUrl = adminSite.websiteUrl;

    new ssm.StringParameter(this, 'AdminSiteUrl', {
      allowedPattern: '.*',
      description: 'The URL of the admin site',
      parameterName: getFQParamName(app, 'AdminSiteUrl'),
      stringValue: this.adminSiteUrl,
    });
  }
}
