import * as AppsyncApi from './lib/appsync-api';

export { AppsyncApi };
export * from './lib/models/index.js';
import * as Mutations from './lib/documents/mutations';
import * as Queries from './lib/documents/queries';
import * as Subscriptions from './lib/documents/subscriptions';

export { Mutations, Queries, Subscriptions}