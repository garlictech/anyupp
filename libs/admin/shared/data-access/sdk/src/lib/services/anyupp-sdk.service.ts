import { Injectable } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';

@Injectable({
  providedIn: 'root',
})
export class AnyuppSdkService {
  public sdk: CrudApi.CrudSdk;

  constructor() {
    this.sdk = CrudApi.getCrudSdkForUserPool();
  }
}
