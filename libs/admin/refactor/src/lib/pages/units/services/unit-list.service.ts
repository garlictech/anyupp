import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { UnitCollectionService } from '../../../store/units';

@Injectable()
export class UnitListService {
  private _nextToken?: string;
  private _working = false;

  constructor(private _unitCollectionService: UnitCollectionService) {}

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working) {
      this._working = true;

      this._unitCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken,
        })
        .subscribe(result => {
          this._nextToken = result?.nextToken || undefined;
          this._working = false;
        });
    }
  }
}
