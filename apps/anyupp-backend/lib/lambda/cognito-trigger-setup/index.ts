import { CloudFormationCustomResourceEvent } from 'aws-lambda';
import { IAM, STS } from 'aws-sdk';
import {
  CreatePolicyResponse,
  DeletePolicyRequest,
  GetPolicyRequest,
} from 'aws-sdk/clients/iam';
import { pipe } from 'fp-ts/lib/function';
import { from, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { sendResponse } from '../utils/send-response';

const region = process.env.AWS_REGION || '';

const iam = new IAM({
  apiVersion: '2010-05-08',
  region,
});

const sts = new STS({
  apiVersion: '2011-06-15',
  region,
});

export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  const physicalResourceId = event.ResourceProperties.physicalResourceId;
  const apiArn: string = event.ResourceProperties.appsyncApiArn;
  const lambdaRoleName: string = event.ResourceProperties.lambdaRoleName;
  const policyName = 'appsync-cognito-pretoken';

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    return from(sts.getCallerIdentity().promise())
      .pipe(
        map(response => ({
          PolicyArn: `arn:aws:iam::${response.Account}:policy/${policyName}`,
        })),
        switchMap((params: GetPolicyRequest | DeletePolicyRequest) =>
          from(iam.getPolicy(params).promise()).pipe(
            switchMap(() => from(iam.deletePolicy(params).promise())),
            // This part assumes that the error comes because the policy does not exist
            // yet. So, try deleting it. If deletion/recreation also fails, give up.
            catchError(() => of(true)),
          ),
        ),
        switchMap(() =>
          pipe(
            {
              Version: '2012-10-17',
              Statement: [
                {
                  Effect: 'Allow',
                  Action: 'appsync:*',
                  Resource: apiArn,
                },
              ],
            },
            policy => ({
              PolicyDocument: JSON.stringify(policy),
              PolicyName: policyName,
            }),
            params => iam.createPolicy(params).promise(),
            from,
          ),
        ),
        map(x => x as CreatePolicyResponse),
        map(response => response.Policy?.Arn),
        filter(arn => !!arn),
        map(policyArn => ({
          PolicyArn: policyArn as string,
          RoleName: lambdaRoleName,
        })),
        switchMap(params => from(iam.attachRolePolicy(params).promise())),
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

  return true;
};
