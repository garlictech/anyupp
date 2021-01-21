import { EAdminRole } from '@bgap/shared/types/enums';
import { IKeyValue } from '@bgap/shared/types/interfaces';

import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bgap-form-admin-role',
  templateUrl: './form-admin-role.component.html',
})
export class FormAdminRoleComponent implements OnInit {
  @Input() roleFormGroup: FormControl;
  public eAdminRole = EAdminRole;
  public roleOptions: IKeyValue[];

  constructor(private _translateService: TranslateService) {
    this.roleOptions = Object.keys(EAdminRole).map(
      (key): IKeyValue => ({
        key: EAdminRole[key],
        value: this._translateService.instant(`roles.${EAdminRole[key]}`),
      })
    );
  }

  ngOnInit(): void {
    this.roleFormGroup['controls'].role.valueChanges.subscribe(
      (): void => {
        this.roleFormGroup['controls'].entities.patchValue([]);
      }
    );
  }
}
