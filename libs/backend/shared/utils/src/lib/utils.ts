import * as sst from '@serverless-stack/resources';

export const getFQParamNameFromDetails = (
  stage: string,
  appName: string,
  paramName: string,
) => `/${stage}-${appName}/generated/${paramName}`;

export const getFQParamName = (app: sst.App, paramName: string) =>
  getFQParamNameFromDetails(app.stage, app.name, paramName);

export const commonBackendStack = 'common-backend-anyupp';
export const anyuppVpcName = 'AnyuppVpc2';
export const anyuppFargateClusterName = 'anyupp-fargate-cluster';
export const anyuppVpcSecurityGroupParamName =
  '/common/AnyuppVpcSecurityGroupName';
export const anyuppVpcIdParamName = '/common/AnyuppVpcId';

export const getCommonVpcNameDev = () =>
  `dev-${commonBackendStack}/${anyuppVpcName}`;

export const getCommonVpcNameProd = () =>
  `prod-${commonBackendStack}/${anyuppVpcName}`;
