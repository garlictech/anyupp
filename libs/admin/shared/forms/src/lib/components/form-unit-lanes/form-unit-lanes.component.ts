import { FormsService } from '../../../../services/forms';
import { IState } from '../../../../../store';
import { productListSelectors } from '../../../../../store/selectors';

import { Component, Input, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-form-unit-lanes',
  templateUrl: './form-unit-lanes.component.html',
  styleUrls: ['./form-unit-lanes.component.scss'],
})
export class FormUnitLanesComponent implements OnInit {
  @Input() lanesFormArray: FormArray;
  public usedLaneIds: string[];

  constructor(
    private _store: Store<any>,
    private _formsService: FormsService
  ) {
    this.usedLaneIds = [];
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(productListSelectors.getUnitProductLaneIds()),
        untilDestroyed(this)
      )
      .subscribe((laneIds: string[]): void => {
        this.usedLaneIds = laneIds;
      });
  }

  public addLane(): void {
    this.lanesFormArray.push(this._formsService.createLaneFormGroup());
  }

  public removeLane(idx: number): void {
    this.lanesFormArray.removeAt(idx);
  }
}
