import awsmobile from './lib/generated/aws-exports';
import * as CrudApi from './lib/generated/api';
import * as Mutations from './lib/generated/graphql/mutations';
import * as Queries from './lib/generated/graphql/queries';
import * as CustomQueries from './lib/custom-documents/queries';
import * as Subscriptions from './lib/generated/graphql/subscriptions';

export const CrudApiQueryDocuments = { ...Queries, ...CustomQueries };
export {
  awsmobile as awsConfig,
  CrudApi,
  Mutations as CrudApiMutationDocuments,
  Subscriptions as CrudApiSubscriptionDocuments,
};
