import * as sst from '@serverless-stack/resources';
import { WebsiteConstruct } from './website-construct';

export class SiteStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    new WebsiteConstruct(this, 'Admin', {
      domainName: 'gtracksport.com',
      siteSubDomain: 'admin',
      distDir: __dirname + '../../../../../../dist/apps/admin'
    });
  }
}
