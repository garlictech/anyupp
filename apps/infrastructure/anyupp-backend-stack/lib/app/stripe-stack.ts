import { App, Stack, StackProps } from '@serverless-stack/resources';

export type RestApiStackProps = StackProps

export class RestApiStack extends Stack {
  constructor(scope: App, id: string, props?: RestApiStackProps) {
    super(scope, id, props);
  }
}
