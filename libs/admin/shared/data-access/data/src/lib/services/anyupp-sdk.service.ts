import { Injectable } from '@angular/core';
import * as AnyuppApi from '@bgap/anyupp-gql/api';

@Injectable({
  providedIn: 'root',
})
export class AnyuppSdkService {
  public sdk: AnyuppApi.AnyuppSdk;

  constructor() {
    this.sdk = AnyuppApi.getAnyuppSdkForUserPool();
  }
}
