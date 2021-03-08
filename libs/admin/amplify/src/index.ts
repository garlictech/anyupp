export * from './lib/api';

import * as Mutations from './lib/documents/mutations';
import * as Queries from './lib/documents/queries';
import * as Subscriptions from './lib/documents/subscriptions';

import  awsmobile  from './lib/aws-exports';

export { Mutations, Queries, Subscriptions, awsmobile}