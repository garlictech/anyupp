import { Apollo } from 'apollo-angular';
import { IKeyValueObject } from '@bgap/shared/types';

import { Injectable } from '@angular/core';
import { CreateAdminUser, UpdateAdminUser, GetAdminUsers } from '@bgap/api/graphql/schema';

@Injectable({
  providedIn: 'root',
})
export class GraphQLService {
  constructor(private _apollo: Apollo) {}

  //
  // ADMIN USER
  //

  public getAdminUsers() {
    return this._apollo.query({
      query: GetAdminUsers
    });
  }

  public createAdminUser(data: IKeyValueObject) {
    return this._apollo.mutate({
      mutation: CreateAdminUser,
      variables: {
        data,
      },
    });
  }

  public updateAdminUser(id: string, data: IKeyValueObject) {
    return this._apollo.mutate({
      mutation: UpdateAdminUser,
      variables: {
        data,
        id,
      },
    });
  }
}
