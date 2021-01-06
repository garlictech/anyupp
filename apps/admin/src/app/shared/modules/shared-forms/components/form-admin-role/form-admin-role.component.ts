import { EAdminRole } from 'src/app/shared/enums';
import { IKeyValue } from 'src/app/shared/interfaces';

import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-admin-role',
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
    this.roleFormGroup['controls'].role.valueChanges.subscribe((role: EAdminRole): void => {
      this.roleFormGroup['controls'].entities.patchValue([]);
    });
  }
}
