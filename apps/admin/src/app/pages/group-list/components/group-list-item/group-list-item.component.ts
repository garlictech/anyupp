import { cloneDeep as _cloneDeep } from 'lodash-es';
import { IGroup } from '../../shared/interfaces';

import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { GroupFormComponent } from '../group-form/group-form.component';

@Component({
  selector: 'app-group-list-item',
  templateUrl: './group-list-item.component.html',
  styleUrls: ['./group-list-item.component.scss'],
})
export class GroupListItemComponent {
  @Input() group: IGroup;

  constructor(private _nbDialogService: NbDialogService) {}

  public editGroup(): void {
    const dialog = this._nbDialogService.open(GroupFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.group = _cloneDeep(this.group);
  }
}
