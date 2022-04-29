import { stuckOrderCleanupHandler } from '@bgap/rkeeper-api';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';

const deps = {
  sdk: getCrudSdkForIAM(
    process.env.API_ACCESS_KEY_ID || '',
    process.env.API_SECRET_ACCESS_KEY || '',
  ),
  now: () => Date.now(),
  timeStamp: (dateString: string) => new Date(dateString).getTime(),
};

export const handler = () => {
  return stuckOrderCleanupHandler(deps).toPromise();
};
