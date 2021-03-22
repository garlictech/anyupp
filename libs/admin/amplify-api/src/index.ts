export * from './lib/generated/api';
export * from './lib/generated/graphql/mutations';
export * from './lib/generated/graphql/subscriptions';
export * from './lib/generated/graphql/queries';

import * as Mutations from './lib/generated/graphql/mutations';
import * as Queries from './lib/generated/graphql/queries';
import * as Subscriptions from './lib/generated/graphql/subscriptions';

import awsmobile from './lib/generated/aws-exports';
export { awsmobile as awsConfig, Mutations, Queries, Subscriptions };
