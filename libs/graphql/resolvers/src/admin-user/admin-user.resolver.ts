import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import * as admin from 'firebase-admin';
import { AdminUser, UpdateAdminUserInput } from '@bgap/graphql/schema';
import { Inject } from '@nestjs/common';

@Resolver('AdminUser')
export class AdminUserResolver {
  constructor(@Inject('PUB_SUB') private pubSub: PubSub) {
    // Thus guy subscribes to the admin list element changes, whenever
    // it changes, publishes them to the graphwl subscribers.
    admin
      .database()
      .ref(`adminUsers`)
      .on('child_changed', data =>
        this.pubSub.publish('adminUserChanged', {
          adminUserChanged: { id: data.key, ...data.val() },
        })
      );
  }

  @Query('getAdminUser')
  async getAdminUser(@Args('id') id: string): Promise<AdminUser> {
    return admin
      .database()
      .ref(`adminUsers/${id}`)
      .once('value')
      .then(snap => snap.val());
  }

  @Mutation('updateAdminUser')
  async updateAdminUser(
    @Args('newAdminData') newAdminData: UpdateAdminUserInput,
    @Args('id') id: string
  ): Promise<boolean> {
    return admin
      .database()
      .ref(`adminUsers/${id}`)
      .update(newAdminData)
      .then(() => true);
  }

  // Subscribe for the changes of a [articular admin user]
  @Subscription('adminUserChanged', {
    filter: (payload, variables) =>
      payload.adminUserChanged.id === variables.id,
  })
  adminUserChanged() {
    return this.pubSub.asyncIterator('adminUserChanged');
  }
}
