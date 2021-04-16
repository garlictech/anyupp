import * as sst from '@serverless-stack/resources';

export const getFQParamName = (app: sst.App, paramName: string) =>
  getFQParamNameFromDetails(app.stage, app.name, paramName);

export const getFQParamNameFromDetails = (
  stage: string,
  appName: string,
  paramName: string,
) => `/${stage}-${appName}/generated/${paramName}`;
