import {
  aws_certificatemanager as acm,
  aws_route53 as route53,
  aws_route53_targets as route53Targets,
  aws_ssm as ssm,
  aws_apigateway as apigateway,
  CfnOutput,
} from 'aws-cdk-lib';
import * as sst from '@serverless-stack/resources';
import * as fp from 'lodash/fp';

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
    endpointType: apigateway.EndpointType.EDGE,
  });

  if (app.stage !== 'prod') {
    new route53.ARecord(scope, `Anyupp-${apiName}-DNS`, {
      zone,
      recordName: `${apiNameFQ}`,
      target: route53.RecordTarget.fromAlias(
        new route53Targets.ApiGateway(api),
      ),
    });
  }

  const endpoint =
    app.stage === 'prod'
      ? api.url
      : `https://${api.domainName?.domainName || 'SOMETHING IS WRONG'}/${
          app.stage
        }`;

  new CfnOutput(scope, `${apiName}Endpoint`, {
    value: endpoint,
  });

  const paramName = `${fp.upperFirst(fp.camelCase(apiName))}Endpoint`;

  new ssm.StringParameter(scope, `${paramName}Param`, {
    allowedPattern: '.*',
    parameterName: getFQParamName(app, paramName),
    stringValue: endpoint,
  });
};
