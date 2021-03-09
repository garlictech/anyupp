import path from 'path';

import * as appsync from '@aws-cdk/aws-appsync';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sm from '@aws-cdk/aws-secretsmanager';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import { createStripeResolvers } from '@bgap/stripe';
import { createOrderResolvers } from '@bgap/api/order';
import * as sst from '@serverless-stack/resources';

import { commonLambdaProps } from './lambda-common';
import { PROJECT_ROOT } from './settings';
import { GraphqlApi } from '@aws-cdk/aws-appsync';
import { Duration } from '@aws-cdk/core';
import { DynamoDBStack } from './appsync-dynamodb-stack';

// const stageValidationProperties = (fields: string[]): string =>
//   pipe(
//     fields,
//     (fields: string[]) =>
//       fields.reduce(
//         (acc, field) =>
//           acc +
//           `$util.qr($ctx.stash.put("${field}", $ctx.args.input.${field}))\n`,
//         '',
//       ),
//     res => res + '\n{}',
//   );

// interface ApiDesc {
//   label: string;
//   beforeRequestMappingTemplate: string;
//   dataValidators: AppsyncFunction[];
// }

// interface ApiDesc {
//   label: string;
//   beforeRequestMappingTemplate: string;
//   dataValidators: AppsyncFunction[];
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   createFunction?: any;
// }

export interface AppsyncAppStackProps extends sst.StackProps {
  userPool: cognito.UserPool;
  secretsManager: sm.ISecret;
  dynamoDBStack: DynamoDBStack;
}

export class AppsyncAppStack extends sst.Stack {
  // private validatorResolverFunctions: ValidatorResolverFunctions;
  private noneDs!: appsync.NoneDataSource;
  private userTableDDDs!: appsync.DynamoDbDataSource;
  private orderTableDDDs!: appsync.DynamoDbDataSource;
  private lambdaDs!: appsync.LambdaDataSource;
  private api: GraphqlApi;

  constructor(scope: sst.App, id: string, props: AppsyncAppStackProps) {
    super(scope, id);
    const app = this.node.root as sst.App;

    // Creates the AppSync API
    this.api = new appsync.GraphqlApi(this, 'Api', {
      name: app.logicalPrefixedName('anyupp-appsync-api'),
      schema: appsync.Schema.fromAsset(
        PROJECT_ROOT + 'libs/api/graphql/schema/src/schema/appsync-api.graphql',
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: props.userPool,
            },
          },
        ],
      },
      xrayEnabled: true,
    });

    this.createDatasources(props.secretsManager, props.dynamoDBStack);

    const baseResolverInputParams = {
      api: this.api,
      scope: this,
      userTableDDDs: this.userTableDDDs,
      orderTableDDDs: this.orderTableDDDs,
      lambdaDs: this.lambdaDs,
    };

    createStripeResolvers({
      ...baseResolverInputParams,
    });
    createOrderResolvers({
      ...baseResolverInputParams,
    });

    // this.validatorvalidatorResolverFunctions = createValidatorvalidatorResolverFunctions(this.noneDs);

    // const AdminUserBeforeRequestMappingTemplate = stageValidationProperties([
    //   'address',
    // ]);

    // const emptyBeforeRequestMappingTemplate = '{}';

    // [
    //   {
    //     label: 'AdminUser',
    //     dataValidators: [this.validatorResolverFunctions.validateAddress],
    //     beforeRequestMappingTemplate: AdminUserBeforeRequestMappingTemplate,
    //     createFunction: createAdminUserFunction,
    //   },
    //   {
    //     label: 'Chain',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'Group',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'OrderItem',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'Order',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'ProductCategory',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'ChainProduct',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'Unit',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    //   {
    //     label: 'User',
    //     dataValidators: [],
    //     beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
    //   },
    // ].forEach((apiDesc: ApiDesc) => this.createCommonResolvers(apiDesc));

    new ssm.StringParameter(this, 'GraphqlApiUrlParam', {
      allowedPattern: '.*',
      description: 'The graphql API endpoint URL',
      parameterName: app.logicalPrefixedName('GraphqlApiUrl'),
      stringValue: this.api.graphqlUrl,
    });

    new ssm.StringParameter(this, 'GraphqlApiKeyParam', {
      allowedPattern: '.*',
      description: 'The graphql API key',
      parameterName: app.logicalPrefixedName('GraphqlApiKey'),
      stringValue: this.api.apiKey || '',
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiUrl', {
      value: this.api.graphqlUrl,
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiKey', {
      value: this.api.apiKey || '',
    });
  }

  private createDatasources(
    secretsManager: sm.ISecret,
    dynamoDBStack: DynamoDBStack,
  ) {
    // NO DATA SOURCE
    this.noneDs = new appsync.NoneDataSource(this, 'NoneDataSource', {
      api: this.api,
    });

    // DATABASE DATA SOURCES
    this.userTableDDDs = this.api.addDynamoDbDataSource(
      'UserDynamoDbDataSource',
      dynamoDBStack.userTable,
    );
    this.orderTableDDDs = this.api.addDynamoDbDataSource(
      'OrderDynamoDbDataSource',
      dynamoDBStack.orderTable,
    );

    // LAMBDA DATA SOURCES
    // Create the lambda first. Mind, that we have to build appsync-lambda.zip
    // with serverless bundle, in the build step! So, you have to declare the lambda
    // in serverless.xml as well (see the example)
    const apiLambda = new lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/appsync-lambda/index.handler',
      timeout: Duration.seconds(5),
      memorySize: 256,
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/appsync-lambda.zip'),
      ),
    });

    secretsManager.grantRead(apiLambda);
    this.lambdaDs = this.api.addLambdaDataSource('lambdaDatasource', apiLambda);
  }

  // private createCommonResolvers(apiDesc: ApiDesc): void {
  //   const { label, dataValidators, beforeRequestMappingTemplate } = apiDesc;

  //   const theTable = new TableConstruct(this, label, {
  //     isStreamed: true,
  //   }).theTable;

  //   const tableDs = this.api.addDynamoDbDataSource(
  //     label + 'DynamoDbDataSource',
  //     theTable,
  //   );

  // const createFunction = tableDs.createFunction(
  //   apiDesc.createFunction
  //     ? apiDesc.createFunction
  //     : {
  //         name: 'create' + label,
  //         description: 'Create a ' + label,
  //         requestMappingTemplate: MappingTemplate.fromFile(
  //           'lib/appsync/graphql-api/mapping-templates/common-create-request-mapping-template.vtl',
  //         ),
  //         responseMappingTemplate: MappingTemplate.fromFile(
  //           'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
  //         ),
  //       },
  // );

  //   new Resolver(this, 'create' + label, {
  //     api: this.api,
  //     typeName: 'Mutation',
  //     fieldName: 'create' + label,
  //     requestMappingTemplate: MappingTemplate.fromString(
  //       beforeRequestMappingTemplate,
  //     ),
  //     pipelineConfig: [...dataValidators, createFunction],
  //     responseMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
  //     ),
  //   });

  //   tableDs.createResolver({
  //     typeName: 'Mutation',
  //     fieldName: 'delete' + label,
  //     requestMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-delete-request-mapping-template.vtl',
  //     ),
  //     responseMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
  //     ),
  //   });

  //   tableDs.createResolver({
  //     typeName: 'Query',
  //     fieldName: 'get' + label,
  //     requestMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-get-request-mapping-template.vtl',
  //     ),
  //     responseMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
  //     ),
  //   });

  //   //lambdaDs.createResolver({
  //   //  typeName: 'Mutation',
  //   //  fieldName: `createMultiple${label}s`,
  //   //  requestMappingTemplate: MappingTemplate.fromFile(
  //   //    `lib/appsync/graphql-api/mapping-templates/createMultiple${label}s-request-mapping-template.vtl`
  //   //  ),
  //   //  responseMappingTemplate: MappingTemplate.fromFile(
  //   //    'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
  //   //  )
  //   //});

  //   tableDs.createResolver({
  //     typeName: 'Mutation',
  //     fieldName: 'update' + label,
  //     requestMappingTemplate: MappingTemplate.fromFile(
  //       `lib/appsync/graphql-api/mapping-templates/common-update-request-mapping-template.vtl`,
  //     ),
  //     responseMappingTemplate: MappingTemplate.fromFile(
  //       'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
  //     ),
  //   });
  // }
}
