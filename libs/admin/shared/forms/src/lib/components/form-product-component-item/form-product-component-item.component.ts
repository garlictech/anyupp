import { productComponentSetsSelectors } from '@bgap/admin/shared/data-access/product-component-sets';
import * as fp from 'lodash/fp';
import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getProductComponentSetOptions } from '@bgap/admin/shared/utils';
import { EProductLevel, IKeyValue, IProductComponentSet } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { FormsService } from '../../services/forms/forms.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-component-item',
  templateUrl: './form-product-component-item.component.html',
})
export class FormProductComponentItemComponent implements OnInit, OnDestroy {
  @Input() itemFormArray!: FormArray;
  @Input() productLevel?: EProductLevel;
  public eProductLevel = EProductLevel;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
console.error('TODO edit set items');
  }

  ngOnInit() {
    console.error('???', this.itemFormArray);
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

}
