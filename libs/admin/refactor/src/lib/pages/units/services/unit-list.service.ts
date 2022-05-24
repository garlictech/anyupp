import { combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { loggedUserSelectors } from '../../../store/logged-user';
import { UnitCollectionService } from '../../../store/units';
import { Store } from '@ngrx/store';

@Injectable()
export class UnitListService {
  private _nextToken?: string;
  private _working = false;
  private _selectedChainId?: string | null;
  private _selectedGroupId?: string | null;

  constructor(
    private _store: Store,
    private _unitCollectionService: UnitCollectionService,
  ) {
    combineLatest([
      this._store.select(loggedUserSelectors.getSelectedChainId),
      this._store.select(loggedUserSelectors.getSelectedGroupId),
    ]).subscribe(([selectedChainId, selectedGroupId]) => {
      this._selectedChainId = selectedChainId;
      this._selectedGroupId = selectedGroupId;
    });
  }

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working && this._selectedChainId && this._selectedGroupId) {
      this._working = true;

      this._unitCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken,
          filter: {
            chainId: { eq: this._selectedChainId },
            groupId: { eq: this._selectedGroupId },
          },
        })
        .subscribe(result => {
          this._nextToken = result?.nextToken || undefined;
          this._working = false;
        });
    }
  }
}
