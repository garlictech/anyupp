import * as cdk from '@aws-cdk/core';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as sst from '@serverless-stack/resources';
import * as route53 from '@aws-cdk/aws-route53';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as fp from 'lodash/fp';
import * as ssm from '@aws-cdk/aws-ssm';

export const getFQParamName = (app: sst.App, paramName: string) =>
  getFQParamNameFromDetails(app.stage, app.name, paramName);

export const getFQParamNameFromDetails = (
  stage: string,
  appName: string,
  paramName: string,
) => `/${stage}-${appName}/generated/${paramName}`;

export const createApiDomainName = (
  scope: sst.Stack,
  apiName: string,
  api: apigateway.LambdaRestApi,
  zone: route53.IHostedZone,
  rootDomain: string,
  certificate: acm.ICertificate,
) => {
  const app = scope.node.root as sst.App;
  const apiNameFQ = `${apiName}-${app.stage}`;

  api.addDomainName(`${apiName}-DomainName`, {
    domainName: `${apiNameFQ}.${rootDomain}`,
    certificate: certificate,
    endpointType: apigw.EndpointType.EDGE,
  });

  new route53.ARecord(scope, `Anyupp-${apiName}-DNS`, {
    zone,
    recordName: `${apiNameFQ}`,
    target: route53.RecordTarget.fromAlias(new route53Targets.ApiGateway(api)),
  });

  const endpoint = `https://${
    api.domainName?.domainName || 'SOMETHING IS WRONG'
  }/${app.stage}`;

  new cdk.CfnOutput(scope, `${apiName}Endpoint`, {
    value: endpoint,
  });

  const paramName = `${fp.upperFirst(fp.camelCase(apiName))}Endpoint`;

  new ssm.StringParameter(scope, `${paramName}Param`, {
    allowedPattern: '.*',
    parameterName: getFQParamName(app, paramName),
    stringValue: endpoint,
  });
};
