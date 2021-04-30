import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { IProductComponent } from '@bgap/shared/types';
import { NbDialogService, NbTabComponent, NbTabsetComponent } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductComponentFormComponent } from '../product-component-form/product-component-form.component';

enum EModExtTab {
  PRODUCT_COMPONENTS = 'productComponents',
  MOD_EXT_SETS = 'modExtSets',
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-list',
  templateUrl: './product-component-list.component.html',
  styleUrls: ['./product-component-list.component.scss'],
})
export class ProductComponentListComponent implements OnDestroy {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  public eModExtTab = EModExtTab;
  public selectedTab: EModExtTab = EModExtTab.PRODUCT_COMPONENTS;
  public productComponents$: Observable<IProductComponent[]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
  ) {
     this.productComponents$ = this._store
     .pipe(
       select(productComponentsSelectors.getAllProductComponents),
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
    this._nbDialogService.open(
      this.selectedTab === EModExtTab.PRODUCT_COMPONENTS
        ? ProductComponentFormComponent
        : ProductComponentFormComponent,
      {
        hasBackdrop: true,
        closeOnBackdropClick: false,
        hasScroll: true,
        dialogClass: 'form-dialog',
      },
    );
  }
}
