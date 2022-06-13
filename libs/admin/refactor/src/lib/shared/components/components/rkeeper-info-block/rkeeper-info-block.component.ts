import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Pos } from '@bgap/domain';
import { config } from '@bgap/shared/config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-rkeeper-info-block',
  templateUrl: './rkeeper-info-block.component.html',
  styleUrls: ['./rkeeper-info-block.component.scss'],
})
export class RkeeperInfoBlockComponent {
  @Input() externalId?: string;
  @Input() pos?: Pos | undefined | null;

  public webHookUrl = config.RkeeperWebhookEndpoint;
}
