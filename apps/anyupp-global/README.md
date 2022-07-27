# Global stack (us-east-1)

Global means, that these resources are to be created in us-east-1 exclusively. AWS WAF for Cloudfront, certificates and some other resources
are only allowed to be created in the us-east-1 region, thus created this separate app and stack.

These resources are global per environment, not per account.
For example:
a CloudFront WebAcl(WAF) created in this stack in the 'test' environment in the 'dev' account belongs to the 'test' environment.
In one account as many webacl will be created as many environments (test,dev,qa,staging ... etc) are created.

# Getting Started with Serverless Stack Toolkit

This project was bootstrapped with [Create Serverless Stack](https://github.com/serverless-stack/serverless-stack/tree/master/packages/create-serverless-stack).

Start by installing the dependencies.

```bash
$ yarn install
```

## Commands

### `yarn run build`

Build your app and synthesize your stacks.

Generates a `build/` directory with the compiled files and a `build/cdk.out/` directory with the synthesized CloudFormation stacks.

### `yarn run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy a specific stack.

### `yarn run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally remove a specific stack.

### `yarn test`

Runs your tests using Jest. Takes all the [Jest CLI options](https://jestjs.io/docs/en/cli).

## Documentation

Learn more about the Serverless Stack Toolkit.

- [README](https://github.com/serverless-stack/serverless-stack)
- [@serverless-stack/cli](https://github.com/serverless-stack/serverless-stack/tree/master/packages/cli)
- [@serverless-stack/resources](https://github.com/serverless-stack/serverless-stack/tree/master/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack), [join our chatroom](https://gitter.im/serverless-stack/Lobby), or [post on our forums](https://discourse.serverless-stack.com).
