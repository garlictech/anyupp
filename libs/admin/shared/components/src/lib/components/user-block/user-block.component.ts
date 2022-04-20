import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { getInitials } from '@bgap/admin/shared/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-user-block',
  templateUrl: './user-block.component.html',
  styleUrls: ['./user-block.component.scss'],
})
export class UserBlockComponent implements OnInit {
  @Input() name?: string;
  @Input() title?: string;
  @Input() picture?: string;
  @Output() onNameClick = new EventEmitter();

  public initials = '';

  ngOnInit() {
    this.initials = getInitials(this.name || '');
  }

  public nameClick() {
    //  if (this.onNameClick) {
    this.onNameClick.emit();
    // }
  }
}
