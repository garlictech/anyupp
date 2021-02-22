import * as appsync from '@aws-cdk/aws-appsync';
import {
  AppsyncFunction,
  GraphqlApi,
  MappingTemplate,
  NoneDataSource,
  Resolver,
} from '@aws-cdk/aws-appsync';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';
import * as cdk from '@aws-cdk/core';
import * as sst from '@serverless-stack/resources';
import { pipe } from 'fp-ts/lib/function';
import path from 'path';
import { TableConstruct } from './dynamodb-construct';
import {
  createResolverFunctions,
  ResolverFunctions,
} from './resolver-functions';
import { PROJECT_ROOT } from './settings';
import { commonLambdaProps } from './lambda-common';

const stageValidationProperties = (fields: string[]): string =>
  pipe(
    fields,
    (fields: string[]) =>
      fields.reduce(
        (acc, field) =>
          acc +
          `$util.qr($ctx.stash.put("${field}", $ctx.args.input.${field}))\n`,
        '',
      ),
    res => res + '\n{}',
  );

interface ApiDesc {
  label: string;
  beforeRequestMappingTemplate: string;
  dataValidators: AppsyncFunction[];
}

export class AppsyncAppStack extends sst.Stack {
  private resolverFunctions: ResolverFunctions;
  private noneDs: NoneDataSource;
  private api: GraphqlApi;

  constructor(scope: sst.App, id: string) {
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
      },
      xrayEnabled: true,
    });

    this.noneDs = new NoneDataSource(this, 'NoneDataSource', {
      api: this.api,
    });

    this.resolverFunctions = createResolverFunctions(this.noneDs);

    const AdminUserBeforeRequestMappingTemplate = stageValidationProperties([
      'address',
    ]);

    const emptyBeforeRequestMappingTemplate = '{}';

    [
      {
        label: 'AdminUser',
        dataValidators: [this.resolverFunctions.validateAddress],
        beforeRequestMappingTemplate: AdminUserBeforeRequestMappingTemplate,
      },
      {
        label: 'Chain',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'Group',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'OrderItem',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'Order',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'ProductCategory',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'ChainProduct',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'Unit',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
      {
        label: 'User',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate,
      },
    ].forEach((apiDesc: ApiDesc) => this.createCommonResolvers(apiDesc));

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

    // for testing and edication purposes :)
    this.configureTestLambdaDataSource();
  }

  private configureTestLambdaDataSource(): void {
    // Create the lambda first. Mind, that we have to build appsync-lambda.zip
    // with serverless bundle, in the build step! So, you have to declare the lambda
    // in serverless.xml as well (see the example)
    const apiLambda = new lambda.Function(this, 'AppsyncLambda', {
      ...commonLambdaProps,
      // It must be relative to the serverless.yml file
      handler: 'lib/lambda/appsync-lambda/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/appsync-lambda.zip'),
      ),
    });

    // Ok, we have the lambda resource. Now, we turn it into a data source.
    // Graphql resolvers need data sources, they are the bridge between the
    // resolver and the resource.
    const lambdaDataSource = this.api.addLambdaDataSource(
      'lambdaDatasource',
      apiLambda,
    );

    // Cool, we have a data source. Now, let's hook a resolver for a query to it.
    lambdaDataSource.createResolver({
      // Define the graphql type from the schema (Query)
      typeName: 'Query',
      // the field of the type
      fieldName: 'hellobello',
      // This is a simple example, so we just pass the one-and-only name parameter as is
      // This is how we map the graphql requests to lambda event documents.
      requestMappingTemplate: MappingTemplate.fromString(
        `
        {
          "version" : "2017-02-28",
          "operation" : "Invoke",
          "payload": {
            "fieldName": "hellobello",
            "payload": $util.toJson($context.arguments)
          }
        }
        `,
      ),
      // ... and we return what the lambda returns as is.
      responseMappingTemplate: MappingTemplate.fromString(
        '$util.toJson($context.result)',
      ),
    });
  }

  private createCommonResolvers(apiDesc: ApiDesc): void {
    const { label, dataValidators, beforeRequestMappingTemplate } = apiDesc;

    const theTable = new TableConstruct(this, label, {
      isStreamed: true,
    }).theTable;

    const tableDs = this.api.addDynamoDbDataSource(
      label + 'DynamoDbDataSource',
      theTable,
    );

    const createFunction = tableDs.createFunction({
      name: 'create' + label,
      description: 'Create a ' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-create-request-mapping-template.vtl',
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
      ),
    });

    new Resolver(this, 'create' + label, {
      api: this.api,
      typeName: 'Mutation',
      fieldName: 'create' + label,
      requestMappingTemplate: MappingTemplate.fromString(
        beforeRequestMappingTemplate,
      ),
      pipelineConfig: [...dataValidators, createFunction],
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
      ),
    });

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'delete' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-delete-request-mapping-template.vtl',
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
      ),
    });

    tableDs.createResolver({
      typeName: 'Query',
      fieldName: 'get' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-get-request-mapping-template.vtl',
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
      ),
    });

    //lambdaDs.createResolver({
    //  typeName: 'Mutation',
    //  fieldName: `createMultiple${label}s`,
    //  requestMappingTemplate: MappingTemplate.fromFile(
    //    `lib/appsync/graphql-api/mapping-templates/createMultiple${label}s-request-mapping-template.vtl`
    //  ),
    //  responseMappingTemplate: MappingTemplate.fromFile(
    //    'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
    //  )
    //});

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'update' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        `lib/appsync/graphql-api/mapping-templates/common-update-request-mapping-template.vtl`,
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl',
      ),
    });
  }
}
