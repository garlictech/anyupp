import * as AWS from 'aws-sdk';

import {
  Item,
  SeederLambdaInvokeArgs,
} from '../../app/seeder/dynamodb-seeder-stack';
import {
  getOrderSeed,
  getUserSeed,
  getUnitSeed,
  getGroupSeed,
  getUnitProductSeed,
} from './seeds';

console.log('function loaded');

// *** HANDLER ***
exports.handler = async (event: SeederLambdaInvokeArgs) => {
  let action = '';

  if (event.mode === 'delete') {
    action = 'Delete';
  }

  if (event.mode === 'create' || event.mode === 'update') {
    action = 'Put';
  }

  try {
    const userId = await createCognitoUser(event.userPoolId);
    await seedDatabase(event, action, userId);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createCognitoUser = async (userPoolId: string): Promise<string> => {
  console.log('starting cognito user creation');
  const cognitoClient = new AWS.CognitoIdentityServiceProvider({});
  const email = 'gyuri@bitgap.com';

  const poolData: AWS.CognitoIdentityServiceProvider.AdminCreateUserRequest = {
    UserPoolId: userPoolId,
    Username: email,
    DesiredDeliveryMediums: ['EMAIL'],
    TemporaryPassword: 'Test12345678',
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
    ],
  };

  const userResponse = await cognitoClient.adminCreateUser(poolData).promise();
  // console.log(
  //   '### ~ file: index.ts ~ line 95 ~ user',
  //   JSON.stringify(userResponse, undefined, 2),
  // );

  if (!userResponse.User) {
    throw 'userNotCreated ERROR';
  }

  console.log('finished cognito user creation');

  return userResponse.User?.Username as string;
};

async function seedDatabase(
  props: SeederLambdaInvokeArgs,
  action: string,
  userId: string,
) {
  const documentClient = new AWS.DynamoDB.DocumentClient({
    convertEmptyValues: true,
  });
  console.log('sending data to dynamodb');
  // USER
  await executeBatchWriteRequestItems({
    seed: getUserSeed(userId),
    tableName: props.tableNames.user,
    action,
    documentClient,
  });
  // ORDER
  await executeBatchWriteRequestItems({
    seed: getOrderSeed(),
    tableName: props.tableNames.order,
    action,
    documentClient,
  });
  // UNIT
  await executeBatchWriteRequestItems({
    seed: getUnitSeed(),
    tableName: props.tableNames.unit,
    action,
    documentClient,
  });
  // GROUP
  await executeBatchWriteRequestItems({
    seed: getGroupSeed(),
    tableName: props.tableNames.group,
    action,
    documentClient,
  });
  // UNIT_PRODUCT
  await executeBatchWriteRequestItems({
    seed: getUnitProductSeed(),
    tableName: props.tableNames.unitProduct,
    action,
    documentClient,
  });

  console.log('finished sending data to dynamodb');
}

const writeTypeFromAction = (action: string): string => {
  if (action === 'Put') {
    return 'Item';
  }
  // if (action === "Delete")
  return 'Key';
};

const executeBatchWriteRequestItems = async ({
  seed,
  tableName,
  action,
  documentClient,
}: {
  seed: Array<any>;
  tableName: string;
  action: string;
  documentClient: AWS.DynamoDB.DocumentClient;
}) => {
  do {
    const batch = seed.splice(0, 25);
    const requests = batch.map((item: Item) => ({
      [action + 'Request']: {
        [writeTypeFromAction(action)]:
          action === 'delete' ? { id: item['id'] } : item,
      },
    }));
    // console.log(
    //   '### ~ file: index.ts ~ line 58 ~ requests',
    //   JSON.stringify(requests, undefined, 2),
    // );
    await documentClient
      .batchWrite({
        RequestItems: {
          [tableName]: [...requests], // TODO: use table name from var
        },
      })
      .promise();
  } while (seed.length > 0);
};
