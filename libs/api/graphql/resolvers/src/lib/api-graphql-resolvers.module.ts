import { PubSub } from 'graphql-subscriptions';

import { ApiDataAccessModule } from '@bgap/api/data-access';
import { SharedSecretsModule } from '@bgap/shared/secrets';
import { Module } from '@nestjs/common';

import { AdminUserResolver } from '../admin-user/admin-user.resolver';
import { StripeResolver } from '../stripe/stripe.resolver';
import { UserResolver } from '../user/user.resolver';

@Module({
  controllers: [],
  providers: [
    StripeResolver,
    AdminUserResolver,
    UserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [ApiDataAccessModule, SharedSecretsModule],
  exports: [],
})
export class ApiGraphqlResolversModule {}
