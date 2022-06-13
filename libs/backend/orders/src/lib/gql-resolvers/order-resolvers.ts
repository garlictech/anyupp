import * as R from 'ramda';

import { LambdaDataSource, MappingTemplate } from '@aws-cdk/aws-appsync-alpha';
import { getAuthenticatedUserIdFromContextIdentity } from '@bgap/anyupp-backend-lib';
import { OrderPolicy, Unit } from '@bgap/domain';

export const createOrderResolvers = ({
  lambdaDs,
}: {
  lambdaDs: LambdaDataSource;
}): void => {
  lambdaDs.createResolver({
    typeName: 'Mutation',
    fieldName: 'createOrderFromCart',
    requestMappingTemplate: MappingTemplate.fromString(
      `
      {
        "version" : "2017-02-28",
        "operation" : "Invoke",
        "payload": {
          "typeName": "Mutation",
          "fieldName": "createOrderFromCart",
          "identity": {
            "username": ${getAuthenticatedUserIdFromContextIdentity}
          },
          "arguments": {
            "input": $util.toJson($ctx.arguments.input)
          }
        }
      }
      `,
    ),
  });
};

export const hasSimplifiedOrder = (unit: Unit): boolean =>
  !R.isNil(unit.orderPolicy) && unit.orderPolicy !== OrderPolicy.full;
