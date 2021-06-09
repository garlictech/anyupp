import {
  seedAdminUser,
  seedBusinessData,
  SeederDependencies,
} from '@bgap/anyupp-backend-lib';
import * as CrudApi from '@bgap/crud-gql/api';
import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { from } from 'rxjs';
import { delay, switchMap, takeLast } from 'rxjs/operators';
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

  const seederDeps: SeederDependencies = {
    //process.env.AWS_ACCESS_KEY_ID || '',
    //process.env.AWS_SECRET_ACCESS_KEY || '',
    crudSdk: CrudApi.getCrudSdkForIAM(
      'AKIAYIT7GMY5WQZFXOOX',
      'shvXP0lODOdUBFL09LjHfUpIb6bZRxVjyjLulXDR',
    ),
    userPoolId: AdminUserPoolId,
    cognitoidentityserviceprovider,
  };

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await seedAdminUser(seederDeps)
      .pipe(
        delay(2000),
        switchMap(userId => seedBusinessData(userId)(seederDeps)),
        takeLast(1),
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
