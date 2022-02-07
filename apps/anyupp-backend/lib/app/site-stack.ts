import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import path from 'path';
import { PROJECT_ROOT } from './settings';
import { getFQParamName } from './utils';
import { WebsiteConstruct } from './website-construct';

export interface SiteStackProps extends sst.StackProps {
  rootDomain: string;
  certificate: acm.ICertificate;
}

export class SiteStack extends sst.Stack {
  public adminSiteUrl: string;

  constructor(scope: sst.App, id: string, props: SiteStackProps) {
    super(scope, id, props);
    const app = this.node.root as sst.App;

    const adminSite = new WebsiteConstruct(this, 'Admin', {
      domainName: props.rootDomain,
      siteSubDomain:
        app.stage === 'prod' ? 'admin2' : `${app.stage}-admin-${app.name}`,
      distDir: path.join(PROJECT_ROOT, '/dist/apps/admin'),
      certificate: props.certificate,
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
