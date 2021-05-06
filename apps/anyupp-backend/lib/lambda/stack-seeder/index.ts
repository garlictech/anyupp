import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  createSeederDeps,
  seedAdminUser,
  seedBusinessData,
} from '@bgap/anyupp-backend-lib';
import { sendResponse } from '../utils/send-response';

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const AdminUserPoolId = event.ResourceProperties.AdminUserPoolId;
  const physicalResourceId = event.ResourceProperties.physicalResourceId;
  const seederDeps = createSeederDeps(
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
  );

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await seedAdminUser(AdminUserPoolId)(seederDeps)
      .pipe(
        switchMap(userId => seedBusinessData(userId)(seederDeps)),
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
