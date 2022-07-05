import { App, Stack } from '@serverless-stack/resources';
import { WafStack } from './app/cf-waf-stack';

export class AnyUppGlobalStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    new WafStack(scope, 'global-waf', {});
  }
}

export default function main(app: App): void {
  new AnyUppGlobalStack(app, 'anyupp-global');
}
