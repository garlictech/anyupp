import { Observable } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { IAdminUser, IChain } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-chain-selector',
  templateUrl: './active-chain-selector.component.html',
  styleUrls: ['./active-chain-selector.component.scss'],
})
export class ActiveChainSelectorComponent implements OnDestroy {
  @Input() showIcon: boolean;
  public chains$: Observable<IChain[]>;
  private _loggedUser!: IAdminUser;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private _store: Store<any>,
    private _dataService: DataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.showIcon = false;
    this.chains$ = this._store.pipe(
      select(chainsSelectors.getAllChains),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((loggedUser: IAdminUser): void => {
        this._loggedUser = loggedUser;
      });
  }

  get selectedChainId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedChainId;
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onChainSelected(chainId: string): void {
    if (
      this._loggedUser?.id &&
      chainId !== this._loggedUser?.settings?.selectedChainId
    ) {
      this._dataService.updateAdminUserSettings(this._loggedUser.id || '', {
        ...(this._loggedUser?.settings || {}),
        selectedChainId: chainId,
        selectedGroupId: null, // Reset group id!
        selectedUnitId: null, // Reset unit id!
        selectedProductCategoryId: null, // Reset category id!
      });
    }

    this._changeDetectorRef.detectChanges();
  }
}
