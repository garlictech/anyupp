import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'lib-admin-button-ui',
  templateUrl: './button-ui.component.html',
  styleUrls: ['./button-ui.component.scss'],
})
export class ButtonUIComponent {
  @Input() label = 'Button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() style: 'primary' | 'danger' | 'success' = 'primary';

  @Output() pushed = new EventEmitter<void>();
}
