import { Module } from '@nestjs/common';
import { StripeResolver } from '../stripe/stripe.resolver';
import { PubSub } from 'graphql-subscriptions';
import { AdminUserResolver } from '../admin-user/admin-user.resolver';

@Module({
  controllers: [],
  providers: [
    StripeResolver,
    AdminUserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  imports: [ApiDataAccessModule],
  exports: [],
})
export class ApiGraphqlResolversModule {}
