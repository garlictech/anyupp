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

## Stacks

### Backup stack

It creates a backup plan and plan rules to backup certain resources. DynamoDB tables and S3 buckets are included.
There is a one-time permission setup required for S3 backups:
[https://docs.aws.amazon.com/aws-backup/latest/devguide/s3-backups.html](https://docs.aws.amazon.com/aws-backup/latest/devguide/s3-backups.html)

NOTE: CDK does not support copying cross-region backups, it needs to be created using the AWS Console.
[https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-region-backup.html](https://docs.aws.amazon.com/aws-backup/latest/devguide/cross-region-backup.html)

## Documentation

Learn more about the Serverless Stack Toolkit.

- [README](https://github.com/serverless-stack/serverless-stack)
- [@serverless-stack/cli](https://github.com/serverless-stack/serverless-stack/tree/master/packages/cli)
- [@serverless-stack/resources](https://github.com/serverless-stack/serverless-stack/tree/master/packages/resources)

## Community

[Follow us on Twitter](https://twitter.com/ServerlessStack), [join our chatroom](https://gitter.im/serverless-stack/Lobby), or [post on our forums](https://discourse.serverless-stack.com).
