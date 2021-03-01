import { CONFIG } from '@bgap/shared/config';

export const environment = {
  production: true,
  id: 'qa',
  name: 'QA',
  gql: {
    // uri: `https://graphql-inmg2ygdca-uc.a.run.app/graphql`,
    http: 'http://localhost:3333/graphql',
    // uri: `wss://graphql-inmg2ygdca-uc.a.run.app/graphql`,
    ws: 'ws://localhost:3333/graphql',
  },
  config: CONFIG,
};
