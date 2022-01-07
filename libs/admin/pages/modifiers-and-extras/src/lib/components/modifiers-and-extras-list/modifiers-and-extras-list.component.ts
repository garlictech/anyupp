import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { productComponentSetsSelectors } from '@bgap/admin/store/product-component-sets';
import { productComponentsSelectors } from '@bgap/admin/store/product-components';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  NbDialogService,
  NbTabComponent,
  NbTabsetComponent,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductComponentFormComponent } from '../product-component-form/product-component-form.component';
import { ProductComponentSetFormComponent } from '../product-component-set-form/product-component-set-form.component';

enum EModExtTab {
  PRODUCT_COMPONENTS = 'productComponents',
  MOD_EXT_SETS = 'modExtSets',
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-modifiers-and-extras-list',
  templateUrl: './modifiers-and-extras-list.component.html',
  styleUrls: ['./modifiers-and-extras-list.component.scss'],
})
export class ModifiersAndExtrasListComponent implements OnInit, OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public eModExtTab = EModExtTab;
  public selectedTab: EModExtTab = EModExtTab.PRODUCT_COMPONENTS;
  public productComponents: CrudApi.ProductComponent[] = [];
  public productComponentSets: CrudApi.ProductComponentSet[] = [];

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  get dirtyProductComponentCount() {
    return this.productComponents.filter(p => p.dirty).length;
  }

  get dirtyProductComponentSetCount() {
    return this.productComponentSets.filter(p => p.dirty).length;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(productComponentsSelectors.getAllProductComponents),
        untilDestroyed(this),
      )
      .subscribe((productComponents: CrudApi.ProductComponent[]) => {
        this.productComponents = productComponents;
        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(
        select(productComponentSetsSelectors.getAllProductComponentSets),
        untilDestroyed(this),
      )
      .subscribe((productComponentSets: CrudApi.ProductComponentSet[]) => {
        this.productComponentSets = productComponentSets;
        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectTab($event: NbTabComponent): void {
    this.selectedTab = <EModExtTab>$event.tabId;

    // Trigger an event to fix CdkVirtualScroll height
    window.dispatchEvent(new Event('resize'));
  }

  public addItem(): void {
    if (this.selectedTab === EModExtTab.PRODUCT_COMPONENTS) {
      this._nbDialogService.open(ProductComponentFormComponent);
    } else {
      this._nbDialogService.open(ProductComponentSetFormComponent);
    }
  }
}
