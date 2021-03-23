import awsmobile from './lib/aws-exports';
import * as AmplifyApi from './lib/generated/api';
import * as Mutations from './lib/generated/graphql/mutations';
import * as Queries from './lib/generated/graphql/queries';
import * as CustomQueries from './lib/custom-documents/queries';
import * as Subscriptions from './lib/generated/graphql/subscriptions';

export const AmplifyApiQueryDocuments = { ...Queries, ...CustomQueries };
export {
  awsmobile as awsConfig,
  AmplifyApi,
  Mutations as AmplifyApiMutationDocuments,
  Subscriptions as AmplifyApiSubscriptionDocuments,
};
