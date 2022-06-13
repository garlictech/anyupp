import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface ToggleButtonOptions {
  toggledText: string;
  untoggledText: string;
}

@Component({
  selector: 'lib-admin-toggle-button-ui',
  templateUrl: './toggle-button-ui.component.html',
  styleUrls: ['./toggle-button-ui.component.scss'],
})
export class ToggleButtonUiComponent {
  @Input() toggled = false;
  @Input() disabled = false;
  @Input() rounded = true;
  @Input() bordered = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() color: 'primary' | 'danger' | 'success' | 'light' = 'primary';
  @Input() options: ToggleButtonOptions = {
    toggledText: 'ON',
    untoggledText: 'OFF',
  };
  @Output() toggledEvent = new EventEmitter<void>();
}
