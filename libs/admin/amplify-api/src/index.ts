import awsmobile from './lib/aws-exports';
import * as AmplifyApi from './lib/generated/api';
import * as AmplifyApiMutations from './lib/generated/graphql/mutations';
import * as Queries from './lib/generated/graphql/queries';
import * as AmplifyApiSubscriptions from './lib/generated/graphql/subscriptions';
import * as CustomQueries from './lib/custom-documents/queries';

export const AmplifyApiQueries = { ...Queries, ...CustomQueries };
export {
  awsmobile as awsConfig,
  AmplifyApi,
  AmplifyApiMutations,
  // Queries + CustomQueries as AmplifyApiQueries,
  AmplifyApiSubscriptions,
};
