import * as sst from '@serverless-stack/resources';
import { WebsiteConstruct } from './website-construct';

export class SiteStack extends sst.Stack {
  public adminSiteUrl: string;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    const adminSite = new WebsiteConstruct(this, 'Admin', {
      domainName: 'anyupp.com',
      siteSubDomain: 'admin',
      distDir: __dirname + '../../../../../../dist/apps/admin'
    });

    this.adminSiteUrl = adminSite.websiteUrl;
  }
}
