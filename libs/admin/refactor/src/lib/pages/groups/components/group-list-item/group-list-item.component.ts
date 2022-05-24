import * as fp from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';

import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss'],
})
export class GroupListItemComponent {
  @Input() group!: CrudApi.Group;

  constructor(private _nbDialogService: NbDialogService) {}

  public editGroup() {
    const dialog = this._nbDialogService.open(GroupFormComponent);

    dialog.componentRef.instance.group = fp.cloneDeep(this.group);
  }
}
