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
  @Input() rounded = false;
  @Input() bordered = true;
  @Input() style: 'primary' | 'danger' | 'success' | 'light' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() readonly pushed = new EventEmitter<void>();
}
