import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';

import { Component, Input, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IAdminUser, IChain } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-active-chain-selector',
  templateUrl: './active-chain-selector.component.html',
  styleUrls: ['./active-chain-selector.component.scss'],
})
export class ActiveChainSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public chains$: Observable<IChain[]>;
  private _adminUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _dataService: DataService) {
    this.showIcon = false;
    this.chains$ = this._store.pipe(
      select(chainsSelectors.getAllChains),
      untilDestroyed(this)
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
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
      this._dataService.updateAdminUserSettings(this._adminUser._id || '', {
        ..._get(this._adminUser, 'settings', {}),
        selectedChainId: chainId,
        selectedGroupId: null, // Reset group id!
        selectedUnitId: null, // Reset unit id!
        selectedProductCategoryId: null, // Reset category id!
      });
    }
  }
}
