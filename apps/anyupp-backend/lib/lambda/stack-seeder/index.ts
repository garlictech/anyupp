import { seedAll, SeederDependencies } from '@bgap/anyupp-backend-lib';
import * as CrudApi from '@bgap/crud-gql/api';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { switchMap } from 'rxjs/operators';
import { from } from 'rxjs';
import { sendResponse } from '../utils/send-response';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.debug('SEEDER handler event:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const AdminUserPoolId = event.ResourceProperties.AdminUserPoolId;
  const physicalResourceId = event.ResourceProperties.physicalResourceId;
  const awsAccessKeyId =
    process.env.API_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '';

  const awsSecretAccessKey =
    process.env.API_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    '';

  const seederDeps: SeederDependencies = {
    crudSdk: CrudApi.getCrudSdkForIAM(awsAccessKeyId, awsSecretAccessKey),
    anyuppSdk: AnyuppApi.getAnyuppSdkForIAM(awsAccessKeyId, awsSecretAccessKey),
    userPoolId: AdminUserPoolId,
    cognitoidentityserviceprovider,
  };

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await seedAll(seederDeps)
      .pipe(
        switchMap(() =>
          from(
            sendResponse({
              status: 'SUCCESS',
              requestId: event.RequestId,
              stackId: event.StackId,
              reason: '',
              physicalResourceId,
              logicalResourceId: event.LogicalResourceId,
              responseUrl: event.ResponseURL,
            }),
          ),
        ),
      )
      .toPromise();
  }
};
