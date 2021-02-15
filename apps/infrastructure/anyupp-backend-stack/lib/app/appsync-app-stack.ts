import * as ssm from '@aws-cdk/aws-ssm';
import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import {
  AppsyncFunction,
  GraphqlApi,
  MappingTemplate,
  NoneDataSource,
  Resolver
} from '@aws-cdk/aws-appsync';
import { PROJECT_ROOT } from './settings';
import { TableConstruct } from './dynamodb-construct';
import {
  ResolverFunctions,
  createResolverFunctions
} from './resolver-functions';
import { pipe } from 'fp-ts/lib/function';

const stageValidationProperties = (fields: string[]): string =>
  pipe(
    fields,
    (fields: string[]) =>
      fields.reduce(
        (acc, field) =>
          acc +
          `$util.qr($ctx.stash.put("${field}", $ctx.args.input.${field}))\n`,
        ''
      ),
    res => res + '\n{}'
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
        PROJECT_ROOT + 'libs/api/graphql/schema/src/schema/appsync-api.graphql'
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365))
          }
        }
      },
      xrayEnabled: true
    });

    //const apiLambda = new lambda.Function(this, 'AppSyncAnyuppHandler', {
    //  ...commonLambdaProps,
    //  handler: 'lib/api/graphql/appsync-lambda/src/index.handler',
    //  code: lambda.Code.fromAsset(
    //    path.join(__dirname, '../../.serverless/graphql-api.zip')
    //  )
    //});

    //const lambdaDs = api.addLambdaDataSource('lambdaDatasource', apiLambda);

    this.noneDs = new NoneDataSource(this, 'NoneDataSource', {
      api: this.api
    });

    this.resolverFunctions = createResolverFunctions(this.noneDs);

    const AdminUserBeforeRequestMappingTemplate = stageValidationProperties([
      'address'
    ]);

    const emptyBeforeRequestMappingTemplate = '{}';

    [
      {
        label: 'AdminUser',
        dataValidators: [this.resolverFunctions.validateAddress],
        beforeRequestMappingTemplate: AdminUserBeforeRequestMappingTemplate
      },
      {
        label: 'Chain',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'Group',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'OrderItem',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'Order',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'ProductCategory',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'ChainProduct',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'Unit',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      },
      {
        label: 'User',
        dataValidators: [],
        beforeRequestMappingTemplate: emptyBeforeRequestMappingTemplate
      }
    ].forEach((apiDesc: ApiDesc) => this.createCommonResolvers(apiDesc));

    new ssm.StringParameter(this, 'GraphqlApiUrlParam', {
      allowedPattern: '.*',
      description: 'The graphql API endpoint URL',
      parameterName: app.logicalPrefixedName('GraphqlApiUrl'),
      stringValue: this.api.graphqlUrl
    });

    new ssm.StringParameter(this, 'GraphqlApiKeyParam', {
      allowedPattern: '.*',
      description: 'The graphql API key',
      parameterName: app.logicalPrefixedName('GraphqlApiKey'),
      stringValue: this.api.apiKey || ''
    });

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiUrl', {
      value: this.api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphqlApiKey', {
      value: this.api.apiKey || ''
    });
  }

  private createCommonResolvers(apiDesc: ApiDesc): void {
    const { label, dataValidators, beforeRequestMappingTemplate } = apiDesc;

    const theTable = new TableConstruct(this, label, {
      isStreamed: true
    }).theTable;

    const tableDs = this.api.addDynamoDbDataSource(
      label + 'DynamoDbDataSource',
      theTable
    );

    const createFunction = tableDs.createFunction({
      name: 'create' + label,
      description: 'Create a ' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-create-request-mapping-template.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    new Resolver(this, 'create' + label, {
      api: this.api,
      typeName: 'Mutation',
      fieldName: 'create' + label,
      requestMappingTemplate: MappingTemplate.fromString(
        beforeRequestMappingTemplate
      ),
      pipelineConfig: [...dataValidators, createFunction],
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    tableDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'delete' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-delete-request-mapping-template.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });

    tableDs.createResolver({
      typeName: 'Query',
      fieldName: 'get' + label,
      requestMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-get-request-mapping-template.vtl'
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
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
        `lib/appsync/graphql-api/mapping-templates/common-update-request-mapping-template.vtl`
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
      )
    });
  }
}
