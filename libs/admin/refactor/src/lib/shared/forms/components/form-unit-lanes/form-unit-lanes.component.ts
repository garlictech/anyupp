import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { productsSelectors } from '../../../../store/products';
import { FormsService } from '../../services/forms/forms.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-unit-lanes',
  templateUrl: './form-unit-lanes.component.html',
})
export class FormUnitLanesComponent implements OnInit {
  @Input() lanesFormArray?: UntypedFormArray;
  public usedLaneIds: string[];

  constructor(
    private _store: Store,
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.usedLaneIds = [];
  }

  ngOnInit() {
    this._store
      .pipe(
        select(productsSelectors.getUnitProductLaneIds),
        untilDestroyed(this),
      )
      .subscribe((laneIds: string[]) => {
        this.usedLaneIds = laneIds;

        this._changeDetectorRef.detectChanges();
      });
  }

  public addLane() {
    (<UntypedFormArray>this.lanesFormArray).push(
      this._formsService.createLaneFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public removeLane(idx: number) {
    (<UntypedFormArray>this.lanesFormArray).removeAt(idx);

    this._changeDetectorRef.detectChanges();
  }
}
