import * as fp from 'lodash/fp';

import { Component, Input } from '@angular/core';
import { IRoleContext } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';

import { RoleContextFormComponent } from '../role-context-form/role-context-form.component';

@Component({
  selector: 'bgap-role-context-list-item',
  templateUrl: './role-context-list-item.component.html',
  styleUrls: ['./role-context-list-item.component.scss'],
})
export class RoleContextListItemComponent {
  @Input() roleContext!: IRoleContext;

  constructor(private _nbDialogService: NbDialogService) {}

  editRoleContext(): void {
    const dialog = this._nbDialogService.open(RoleContextFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.roleContext = fp.cloneDeep(this.roleContext);
  }
}
