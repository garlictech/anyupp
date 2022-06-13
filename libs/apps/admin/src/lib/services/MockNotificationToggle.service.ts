import { Injectable } from '@angular/core';
import { AbsNotificationToggleService } from '@bgap/domain';

@Injectable({
  providedIn: 'root',
})
export class MockNotificationToggleService extends AbsNotificationToggleService {
  constructor() {
    super(false);
  }

  protected onNotificationToggleChange(nextValue: boolean) {
    console.error('onNotificationToggleChange', nextValue);
  }
}
