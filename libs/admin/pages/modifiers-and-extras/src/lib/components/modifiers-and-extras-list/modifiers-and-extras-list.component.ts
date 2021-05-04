import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { productComponentSetsSelectors } from '@bgap/admin/shared/data-access/product-component-sets';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { IProductComponent, IProductComponentSet } from '@bgap/shared/types';
import { NbDialogService, NbTabComponent, NbTabsetComponent } from '@nebular/theme';
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
export class ModifiersAndExtrasListComponent implements OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public eModExtTab = EModExtTab;
  public selectedTab: EModExtTab = EModExtTab.PRODUCT_COMPONENTS;
  public productComponents$: Observable<IProductComponent[]>;
  public productComponentSets$: Observable<IProductComponentSet[]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
  ) {
    this.productComponents$ = this._store.pipe(
      select(productComponentsSelectors.getAllProductComponents),
      untilDestroyed(this),
    );
    this.productComponentSets$ = this._store.pipe(
      select(productComponentSetsSelectors.getAllProductComponentSets),
      untilDestroyed(this),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectTab($event: NbTabComponent): void {
    this.selectedTab = <EModExtTab>$event.tabId;
  }

  public addItem(): void {
    if (this.selectedTab === EModExtTab.PRODUCT_COMPONENTS) {
      this._nbDialogService.open(ProductComponentFormComponent);
    } else {
      this._nbDialogService.open(ProductComponentSetFormComponent);
    }
  }
}
