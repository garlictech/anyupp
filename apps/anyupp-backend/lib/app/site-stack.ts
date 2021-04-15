import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import { WebsiteConstruct } from './website-construct';

export class SiteStack extends sst.Stack {
  public adminSiteUrl: string;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    const app = this.node.root as sst.App;

    const adminSite = new WebsiteConstruct(this, 'Admin', {
      domainName: 'anyupp.com',
      siteSubDomain: 'admin.' + app.name, // TODO: exception in prod stage, use external config or ???
      distDir: __dirname + '../../../../../../dist/apps/admin',
    });

    this.adminSiteUrl = adminSite.websiteUrl;

    new ssm.StringParameter(this, 'AdminSiteUrl', {
      allowedPattern: '.*',
      description: 'The URL of the admin site',
      parameterName: app.logicalPrefixedName('/generated/') + AdminSiteUrl,
      stringValue: this.adminSiteUrl,
    });
  }
}
