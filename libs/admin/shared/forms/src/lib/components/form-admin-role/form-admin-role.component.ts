import { EAdminRole } from '@bgap/shared/types';
import { IKeyValue } from '@bgap/shared/types';

import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'bgap-form-admin-role',
  templateUrl: './form-admin-role.component.html',
})
export class FormAdminRoleComponent implements OnInit {
  @Input() roleFormGroup!: FormGroup;
  public eAdminRole = EAdminRole;
  public roleOptions: IKeyValue[];

  constructor(private _translateService: TranslateService) {
    this.roleOptions = Object.keys(EAdminRole).map(
      (key): IKeyValue => ({
        key: EAdminRole[<keyof typeof EAdminRole>key].toString(),
        value: this._translateService.instant(`roles.${EAdminRole[<keyof typeof EAdminRole>key]}`),
      })
    );
  }

  ngOnInit(): void {
    this.roleFormGroup.get('role')!.valueChanges.subscribe((): void => {
      this.roleFormGroup.get('entities')!.patchValue([]);
    });
  }
}
