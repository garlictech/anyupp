import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  TempUnitRestrictionObject,
  appCoreActions,
} from '../../../../../store/app-core';
import { Store } from '@ngrx/store';

import { map, tap } from 'rxjs/operators';

interface TempAccessObj {
  info: string;
  access: {
    userId: string;
    unitId: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class AppInitializerService {
  constructor(private _store: Store, private _httpClient: HttpClient) {}

  public init$() {
    return this._httpClient
      .get<TempAccessObj>(
        `https://anyuppbackendaa64d58f0bde4eacba269384314b213c180553-staging.s3.eu-west-1.amazonaws.com/public/temp-sec/unit-admin.json?t=${new Date().getTime()}`,
      )
      .pipe(
        tap(data => {
          const restrictionObject: TempUnitRestrictionObject = {};

          data.access.forEach(item => {
            if (!restrictionObject[item.userId]) {
              restrictionObject[item.userId] = [item.unitId];
            } else {
              restrictionObject[item.userId].push(item.unitId);
            }
          });

          // TEMP SECURITY
          this._store.dispatch(
            appCoreActions.setUnitRestrictionObject({
              unitRestrictions: restrictionObject,
            }),
          );
        }),
        map(() => true),
      );
  }
}
