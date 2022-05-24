import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { GroupCollectionService } from '../../../store/groups';
import { Store } from '@ngrx/store';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable()
export class GroupListService {
  private _nextToken?: string;
  private _working = false;
  private _selectedChainId?: string | null;

  constructor(
    private _store: Store,
    private _groupCollectionService: GroupCollectionService,
  ) {
    this._store
      .select(loggedUserSelectors.getSelectedChainId)
      .subscribe(selectedChainId => {
        this._selectedChainId = selectedChainId;
      });
  }

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working && this._selectedChainId) {
      this._working = true;

      this._groupCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken,
          filter: {
            chainId: { eq: this._selectedChainId },
          },
        })
        .subscribe(result => {
          this._nextToken = result?.nextToken || undefined;
          this._working = false;
        });
    }
  }
}
