import * as fp from 'lodash/fp';
import * as CrudApi from '@bgap/crud-gql/api';
import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { RoleContextFormComponent } from '../role-context-form/role-context-form.component';

@Component({
  selector: 'bgap-role-context-list-item',
  templateUrl: './role-context-list-item.component.html',
  styleUrls: ['./role-context-list-item.component.scss'],
})
export class RoleContextListItemComponent {
  @Input() roleContext?: CrudApi.RoleContext;

  constructor(private _nbDialogService: NbDialogService) {}

  editRoleContext(): void {
    const dialog = this._nbDialogService.open(RoleContextFormComponent);

    dialog.componentRef.instance.roleContext = fp.cloneDeep(this.roleContext);
  }
}
