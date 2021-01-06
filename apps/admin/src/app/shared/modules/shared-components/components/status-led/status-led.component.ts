import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-led',
  templateUrl: './status-led.component.html',
  styleUrls: ['./status-led.component.scss'],
})
export class StatusLedComponent {
  @Input() status: boolean;
}
