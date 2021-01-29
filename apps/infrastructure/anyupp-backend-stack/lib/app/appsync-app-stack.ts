import * as path from 'path';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sst from '@serverless-stack/resources';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import { PROJECT_ROOT } from './settings';
import { commonLambdaProps } from './lambda-common';
import {
  GraphqlApi,
  LambdaDataSource,
  MappingTemplate
} from '@aws-cdk/aws-appsync';
import { Table } from '@aws-cdk/aws-dynamodb';

interface AppsyncAppStackProps extends cdk.StackProps {
  adminUserTable: Table;
}

const createCommonResolvers = (
  api: GraphqlApi,
  table: Table,
  lambdaDs: LambdaDataSource,
  label: string
): void => {
  const tableDs = api.addDynamoDbDataSource(
    label + 'DynamoDbDataSource',
    table
  );

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

  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'create' + label,
    requestMappingTemplate: MappingTemplate.fromFile(
      `lib/appsync/graphql-api/mapping-templates/common-create-request-mapping-template.vtl`
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

  //lambdaDs.createResolver({
  //  typeName: 'Mutation',
  //  fieldName: 'update' + label,
  //  requestMappingTemplate: MappingTemplate.fromFile(
  //    `lib/appsync/graphql-api/mapping-templates/update${label}-request-mapping-template.vtl`
  //  ),
  //  responseMappingTemplate: MappingTemplate.fromFile(
  //    'lib/appsync/graphql-api/mapping-templates/common-response-mapping-template.vtl'
  //  )
  //});
};

export class AppsyncAppStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props: AppsyncAppStackProps) {
    super(scope, id, props);
    const app = this.node.root as sst.App;

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'Api', {
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

    const apiLambda = new lambda.Function(this, 'AppSyncAnyuppHandler', {
      ...commonLambdaProps,
      handler: 'lib/api/graphql/appsync-lambda/src/index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../../.serverless/graphql-api.zip')
      )
    });

    const lambdaDs = api.addLambdaDataSource('lambdaDatasource', apiLambda);

    createCommonResolvers(api, props.adminUserTable, lambdaDs, 'AdminUser');

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIURL', {
      value: api.graphqlUrl
    });

    // Prints out the AppSync GraphQL API key to the terminal
    new cdk.CfnOutput(this, 'GraphQLAPIKey', {
      value: api.apiKey || ''
    });
  }
}
