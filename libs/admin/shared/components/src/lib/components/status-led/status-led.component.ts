import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-status-led',
  templateUrl: './status-led.component.html',
  styleUrls: ['./status-led.component.scss'],
})
export class StatusLedComponent {
  @Input() status?: boolean | null;
}
