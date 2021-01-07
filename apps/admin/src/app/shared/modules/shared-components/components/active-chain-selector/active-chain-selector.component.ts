import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { IAdminUser, IChain } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data';
import { IState } from 'src/app/store';
import {
  chainListSelectors,
  currentUserSelectors,
} from 'src/app/store/selectors';

import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-active-chain-selector',
  templateUrl: './active-chain-selector.component.html',
  styleUrls: ['./active-chain-selector.component.scss'],
})
export class ActiveChainSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public chains$: Observable<IChain[]>;
  private _adminUser: IAdminUser;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService
  ) {
    this.showIcon = false;
    this.chains$ = this._store.pipe(
      select(chainListSelectors.getAllChains),
      untilDestroyed(this)
    );

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedChainId(): string {
    return _get(this._adminUser, 'settings.selectedChainId');
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onChainSelected(chainId: string): void {
    if (
      _get(this._adminUser, '_id') &&
      chainId !== _get(this._adminUser, 'settings.selectedChainId')
    ) {
      this._dataService.updateAdminUserSettings(this._adminUser._id, {
        ..._get(this._adminUser, 'settings', {}),
        selectedChainId: chainId,
        selectedGroupId: null, // Reset group id!
        selectedUnitId: null, // Reset unit id!
        selectedProductCategoryId: null, // Reset category id!
      });
    }
  }
}
