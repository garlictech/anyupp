import { Component, Input } from '@angular/core';
import { AbsNotificationToggleService } from '@bgap/domain';
import { Observable } from 'rxjs';

import { ToggleButtonOptions } from '../../ui-widgets/toggle-button-ui/toggle-button-ui.component';

@Component({
  selector: 'lib-admin-notification-toggle',
  templateUrl: './notification-toggle.component.html',
  styleUrls: ['./notification-toggle.component.scss'],
})
export class NotificationToggleComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  public toggled$: Observable<boolean>;
  public disabled = false;
  public options: ToggleButtonOptions = {
    toggledText: '🔊',
    untoggledText: '🔇',
  };

  constructor(
    private _absNotificationToggleService: AbsNotificationToggleService,
  ) {
    this.toggled$ = this._absNotificationToggleService.toggled$;
  }

  public onToggled() {
    this._absNotificationToggleService.toggle();
  }
}
