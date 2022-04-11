import { Observable } from 'rxjs';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ChainCollectionService } from '@bgap/admin/store/chains';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { filterNullish } from '@bgap/shared/utils';
import { DataService } from '@bgap/admin/shared/data-access/data';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-active-chain-selector',
  templateUrl: './active-chain-selector.component.html',
  styleUrls: ['./active-chain-selector.component.scss'],
})
export class ActiveChainSelectorComponent implements OnInit, OnDestroy {
  @Input() showIcon: boolean;
  public chains$: Observable<CrudApi.Chain[]>;
  private _loggedUser!: CrudApi.AdminUser;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
    private _chainCollectionService: ChainCollectionService,
  ) {
    this.showIcon = false;
    this.chains$ = this._chainCollectionService.filteredEntities$;
  }

  get selectedChainId(): string | null | undefined {
    return this._loggedUser?.settings?.selectedChainId;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        filterNullish(),
        untilDestroyed(this),
      )
      .subscribe(loggedUser => {
        this._loggedUser = loggedUser;
        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onChainSelected(chainId: string): void {
    if (
      this._loggedUser?.id &&
      chainId !== this._loggedUser?.settings?.selectedChainId
    ) {
      this._dataService
        .updateAdminUserSettings$(this._loggedUser.id, {
          ...(this._loggedUser?.settings || {}),
          selectedChainId: chainId,
          selectedGroupId: null, // Reset group id!
          selectedUnitId: null, // Reset unit id!
          selectedProductCategoryId: null, // Reset category id!
        })
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
