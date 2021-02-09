import { PubSub } from 'graphql-subscriptions';

import { AuthService, DatabaseService } from '@bgap/api/data-access';
import { objectToArray } from '@bgap/shared/utils';
import {
  AdminUser,
  CreateAdminUserInput,
  AdminUserRoleInput,
  UpdateAdminUserInput
} from '@bgap/api/graphql/schema';
import { EAdminRole, IAdminUser } from '@bgap/shared/types';
import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';

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
        adminUserChanged: { id: data.key, ...data.val() }
      })
    );
  }

  @Query('getAdminUser')
  async getAdminUser(@Args('id') id: string): Promise<AdminUser> {
    return this.databaseService
      .adminUserRef(id)
      .once('value')
      .then(snap => snap.val());
  }

  @Query('getAdminUsers')
  async getAdminUsers(): Promise<IAdminUser[]> {
    return this.databaseService
      .adminUsersRef()
      .once('value')
      .then(snap => <IAdminUser[]>objectToArray(snap.val()));
  }

  @Mutation('createAdminUser')
  async createAdminUser(
    @Args('newAdminData') newAdminData: CreateAdminUserInput
  ): Promise<boolean> {
    const createInactiveAdminUser = (uid: string) => {
      return this.databaseService
        .adminUserRef(uid)
        .update({
          ...newAdminData,
          roles: {
            role: EAdminRole.INACTIVE
          }
        })
        .then(
          () => true,
          () => false
        );
    };

    if (!newAdminData.email) {
      throw new Error('Admin email is missing'); // TODO: create better error.
    }

    try {
      const user = await this.authService.auth.createUser({
        email: newAdminData.email,
        password: Math.random().toString(36).substring(2, 10)
      });

      return user ? createInactiveAdminUser(user.uid) : false;
    } catch (err) {
      if (err.code === 'auth/email-already-exists') {
        const existingUser = await this.authService.auth.getUserByEmail(
          newAdminData.email
        );

        return existingUser ? createInactiveAdminUser(existingUser.uid) : false;
      }
    }

    return false;
  }

  @Mutation('updateAdminUser')
  async updateAdminUser(
    @Args('newAdminData') newAdminData: UpdateAdminUserInput,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.databaseService
      .adminUserRef(id)
      .update(newAdminData)
      .then(() => true);
  }

  @Mutation('updateAdminUserRole')
  async updateAdminUserRole(
    @Args('newAdminRoleData') newAdminRoleData: AdminUserRoleInput,
    @Args('id') id: string
  ): Promise<boolean> {
    return this.databaseService
      .adminUserRolesRef(id)
      .update(newAdminRoleData)
      .then(() => true);
  }

  // TODO: is this filter works, or the subscription in the constructor the one who triggers the changes?
  // Subscribe for the changes of a [articular admin user]
  @Subscription('adminUserChanged', {
    filter: (payload, variables) => payload.adminUserChanged.id === variables.id
  })
  onChanged() {
    return this.pubSub.asyncIterator('adminUserChanged');
  }
}
