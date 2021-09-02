import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { IKeyValue } from '@bgap/shared/types';
import { UntilDestroy } from '@ngneat/until-destroy';

import { FormsService } from '../../services/forms/forms.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-unit-pos',
  styleUrls: ['./form-unit-pos.component.scss'],
  templateUrl: './form-unit-pos.component.html',
})
export class FormUnitPosComponent implements OnInit {
  @Input() posFormGroup!: FormGroup;

  public ePosType = CrudApi.PosType;
  public posTypeOptions: IKeyValue[] = [
    {
      key: CrudApi.PosType.anyupp,
      value: 'AnyUPP',
    },
    {
      key: CrudApi.PosType.rkeeper,
      value: 'RKeepeR',
    },
  ];

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.posFormGroup.controls['type'].valueChanges.subscribe(newTypeValue => {
      if (newTypeValue === CrudApi.PosType.rkeeper) {
        this.posFormGroup.controls['rkeeper'].enable();

        if (!this.posFormGroup.value.rkeeper?.anyuppPassword) {
          this.generateNewPassword();

          (<FormGroup>this.posFormGroup.controls['rkeeper']).controls[
            'anyuppUsername'
          ].patchValue('user');
        }
      } else {
        this.posFormGroup.controls['rkeeper'].disable();
      }

      // detectChanges not refresh the UI correctly!
      this._changeDetectorRef.markForCheck();
    });
  }

  public generateNewPassword() {
    if (this.posFormGroup.controls['rkeeper']) {
      this._formsService.generateRkeeperPassword(
        <FormGroup>this.posFormGroup.controls['rkeeper'],
      );
    }
  }
}
