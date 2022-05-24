import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';

import { ChainCollectionService } from '../../../store/chains';
import { switchMap } from 'rxjs/operators';

@Injectable()
export class ChainListService {
  private _nextToken?: string;
  private _working = false;

  constructor(private _chainCollectionService: ChainCollectionService) {}

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working) {
      this._working = true;

      this._chainCollectionService
        .getCurrentUserChainFilter$()
        .pipe(
          switchMap(filter =>
            this._chainCollectionService.getCachedPaginatedData$({
              limit: PAGINATION_LIMIT,
              nextToken: this._nextToken,
              filter,
            }),
          ),
        )
        .subscribe(result => {
          this._nextToken = result?.nextToken || undefined;
          this._working = false;
        });
    }
  }
}
