import { combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { AbsNotificationToggleService } from '@bgap/domain';
import { select, Store } from '@ngrx/store';

import { appCoreActions, appCoreSelectors } from '../../../store/app-core';

const STORAGE_KEY_PLAY_NOTIFICATION = 'playNotification';

@Injectable({
  providedIn: 'root',
})
export class NotificationToggleService extends AbsNotificationToggleService {
  constructor(private _store: Store) {
    super(localStorage.getItem(STORAGE_KEY_PLAY_NOTIFICATION) === 'true');

    combineLatest([
      this._store.pipe(select(appCoreSelectors.getPlayNewOrderNotification)),
      this.toggled$,
    ])
      .pipe(
        debounceTime(3000),
        filter(([play, toggled]) => play && toggled),
      )
      .subscribe(() => {
        this._playNotificationSound();

        this._store.dispatch(
          appCoreActions.setPlayNewOrderNotification({
            playNewOrderNotification: false,
          }),
        );
      });
  }

  protected onNotificationToggleChange(nextValue: boolean) {
    localStorage.setItem(STORAGE_KEY_PLAY_NOTIFICATION, String(nextValue));
  }
}
