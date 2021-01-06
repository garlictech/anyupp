import { Resolver, Query, Args } from '@nestjs/graphql';
import { AdminUser } from '@bgap/graphql/schema';
import * as admin from 'firebase-admin';

@Resolver('AdminUser')
export class GetAdminUserResolver {
  @Query('getAdminUser')
  async getAdminUser(@Args('id') id: string): Promise<AdminUser> {
    return admin
      .database()
      .ref(`adminUsers/${id}`)
      .once('value')
      .then((snap) => snap.val());
  }
}
