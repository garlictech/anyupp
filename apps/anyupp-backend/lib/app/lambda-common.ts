import { aws_lambda as lambda } from 'aws-cdk-lib';

export const commonLambdaProps = {
  runtime: lambda.Runtime.NODEJS_14_X,
  bundling: {
    minify: true,
  },
};
