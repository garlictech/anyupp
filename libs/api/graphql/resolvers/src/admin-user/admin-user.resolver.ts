import { PubSub } from 'graphql-subscriptions';

import { EAdminRole } from '@bgap/shared/types';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { DatabaseService, AuthService } from '@bgap/api/data-access';
import {
  AdminUser,
  UpdateAdminUserInput,
  CreateAdminUserInput,
} from '@bgap/api/graphql/schema';

@Resolver('AdminUser')
export class AdminUserResolver {
  constructor(
    @Inject('PUB_SUB') private pubSub: PubSub,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {
    // Subscribing to the admin list element changes, whenever
    // it changes, publishes them to the graphql subscribers.
    this.databaseService.adminUsersRef().on('child_changed', data =>
      this.pubSub.publish('adminUserChanged', {
        adminUserChanged: { id: data.key, ...data.val() },
      })
    );
  }

  @Query('getAdminUser')
  async get(@Args('id') id: string): Promise<AdminUser> {
    return this.databaseService
      .adminUserRef(id)
      .once('value')
      .then(snap => snap.val());
  }

  @Mutation('updateAdminUser')
  async update(
    @Args('newAdminData') newAdminData: UpdateAdminUserInput,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.databaseService
      .adminUserRef(id)
      .update(newAdminData)
      .then(() => true);
  }

  @Mutation('createAdminUser')
  async create(
    @Args('newAdminData') newAdminData: CreateAdminUserInput
  ): Promise<boolean> {
    const user = await this.authService.auth.createUser({
      ...newAdminData,
      password: Math.random().toString(36).substring(2, 10),
    });
    return this.databaseService
      .adminUserRef(user.uid)
      .update({
        ...newAdminData,
        roles: {
          role: EAdminRole.INACTIVE,
        },
      })
      .then(() => true);
  }

  // TODO: is this filter works, or the subscription in the constructor the one who triggers the changes?
  // Subscribe for the changes of a [articular admin user]
  @Subscription('adminUserChanged', {
    filter: (payload, variables) =>
      payload.adminUserChanged.id === variables.id,
  })
  onChanged() {
    return this.pubSub.asyncIterator('adminUserChanged');
  }
}
