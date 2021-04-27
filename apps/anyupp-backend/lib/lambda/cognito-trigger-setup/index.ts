import { CloudFormationCustomResourceEvent } from 'aws-lambda';

/*import { IAM } from 'aws-sdk';

const iam = new AWS.IAM({
  apiVersion: '2010-05-08',
  region: process.env.AWS_REGION || ''
});

const apiAccessPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
          "Action": "appsync:*",
            "Resource": "RESOURCE_ARN"
        }
    ]
};
*/
export const handler = async (event: CloudFormationCustomResourceEvent) => {
  console.log('### EVENT:', JSON.stringify(event, null, 2));

  /**
   * See the AWS documentation for more information passed in the request for a custom resource.
   *
   * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/crpg-ref-requests.html
   */
  //const physicalResourceId = event.ResourceProperties.physicalResourceId;
  //const roleArns: string[] = JSON.parse(event.ResourceProperties.roleArns).arns

  /*
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
      const policySetters = roleArns.map((arn, i) => pipe(
        {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
            "Action": "appsync:*",
              "Resource": arn 
          }
      ]
  
        },
        policy => ({
          {
    PolicyDocument: JSON.stringify(policy),
    PolicyName: 'appsync-policy' + i,
  }),
    params => iam.createPolicy(params).promise(),
    from
      ))
  
      await combineLatest(policySetters).pipe(
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
    }*/
};
