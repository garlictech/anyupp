import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import axios from 'axios';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { seedAdminUser, seedBusinessData } from '@bgap/anyupp-backend-lib';

/**
 * See the AWS documentation for more information on what needs to be contained in the
 * response of a custom resource.
 *
 * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-responses.html
 */
const sendResponse = async (props: any) => {
  const body = {
    Status: props.status,
    Reason: props.reason,
    StackId: props.stackId,
    RequestId: props.requestId,
    LogicalResourceId: props.logicalResourceId,
  };

  const responseBody = JSON.stringify(body);
  console.log({ responseBody });

  await axios.put(props.responseUrl, responseBody, {
    data: responseBody,
    headers: { 'content-type': '', 'content-length': responseBody.length },
  });
};

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
