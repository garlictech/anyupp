import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '../../../../shared/utils';
import { ProductComponentSetCollectionService } from '../../../../store/product-component-sets';
import { ProductComponentCollectionService } from '../../../../store/product-components';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  NbDialogService,
  NbTabComponent,
  NbTabsetComponent,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { ModifiersAndExtrasListService } from '../../services/modifiers-and-extras-list.service';
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
export class ModifiersAndExtrasListComponent implements OnInit {
  @ViewChild('tabset') tabsetEl!: NbTabsetComponent;

  @ViewChild('productComponentVSVP')
  productComponentVSVP?: CdkVirtualScrollViewport;
  @ViewChild('productComponentSetVSVP')
  productComponentSetVSVP?: CdkVirtualScrollViewport;

  public eModExtTab = EModExtTab;
  public selectedTab: EModExtTab = EModExtTab.PRODUCT_COMPONENTS;
  public productComponents: CrudApi.ProductComponent[] = [];
  public productComponentSets: CrudApi.ProductComponentSet[] = [];

  constructor(
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modifiersAndExtrasListService: ModifiersAndExtrasListService,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
  ) {}

  get dirtyProductComponentCount() {
    return this.productComponents.filter(p => p.dirty).length;
  }

  get dirtyProductComponentSetCount() {
    return this.productComponentSets.filter(p => p.dirty).length;
  }

  ngOnInit() {
    this._productComponentCollectionService.filteredEntities$
      .pipe(untilDestroyed(this))
      .subscribe((productComponents: CrudApi.ProductComponent[]) => {
        this.productComponents = productComponents;
        this._changeDetectorRef.detectChanges();
      });

    this._productComponentSetCollectionService.filteredEntities$
      .pipe(untilDestroyed(this))
      .subscribe((productComponentSets: CrudApi.ProductComponentSet[]) => {
        this.productComponentSets = productComponentSets;
        this._changeDetectorRef.detectChanges();
      });
  }

  public selectTab($event: NbTabComponent) {
    this.selectedTab = <EModExtTab>$event.tabId;

    // Trigger an event to fix CdkVirtualScroll height
    window.dispatchEvent(new Event('resize'));
  }

  public addItem() {
    if (this.selectedTab === EModExtTab.PRODUCT_COMPONENTS) {
      this._nbDialogService.open(ProductComponentFormComponent);
    } else {
      this._nbDialogService.open(ProductComponentSetFormComponent);
    }
  }

  public loadNextProductComponentPaginatedData(
    count: number,
    itemCount: number,
  ) {
    if (
      itemCount - count <
      visibleLinesOnViewport(
        this.productComponentVSVP?.elementRef.nativeElement,
      )
    ) {
      this._modifiersAndExtrasListService.loadNextProductComponentPaginatedData();
    }
  }

  public loadNextProductComponentSetPaginatedData(
    count: number,
    itemCount: number,
  ) {
    if (
      itemCount - count <
      visibleLinesOnViewport(
        this.productComponentSetVSVP?.elementRef.nativeElement,
      )
    ) {
      this._modifiersAndExtrasListService.loadNextProductComponentSetPaginatedData();
    }
  }
}
