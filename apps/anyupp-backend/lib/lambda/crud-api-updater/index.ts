import { CloudFormationCustomResourceEvent, Handler } from 'aws-lambda';
import { forkJoin, from, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { sendResponse } from '../utils/send-response';
import { createIndices$ } from './geoindices';
import { configurePools } from './configure-pools';
import { configureOpenSearchPolicy } from './configure-opensearch-policy';

export const handler: Handler = async (
  event: CloudFormationCustomResourceEvent,
) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const physicalResourceId = event.ResourceProperties.physicalResourceId;
  const userPoolId = event.ResourceProperties.userPoolId;

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    return forkJoin([
      createIndices$,
      configurePools(userPoolId),
      configureOpenSearchPolicy,
    ])
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
        catchError(err =>
          JSON.stringify(err, null, 2).includes(
            'Additional authentication provider',
          )
            ? of(true)
            : throwError(err),
        ),
      )
      .toPromise();
  }

  return true;
};
