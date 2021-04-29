import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { from } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';

import { seedAdminUser, seedBusinessData } from '@bgap/anyupp-backend-lib';
import { sendResponse } from '../lambda.utils';

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const AdminUserPoolId = event.ResourceProperties.AdminUserPoolId;
  const physicalResourceId = event.ResourceProperties.physicalResourceId;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    await seedAdminUser(AdminUserPoolId)
      .pipe(
        delay(2000),
        switchMap(userId => seedBusinessData(userId)),
        //   mapTo('SUCCESS'),
        //   catchError((error: AWSError) => {
        //     console.log("Probably 'normal' error: ", error);
        //     return of('SUCCESS');
        //   }),
        // ),
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
