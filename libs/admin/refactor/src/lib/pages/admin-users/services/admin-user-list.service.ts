import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { AdminUserCollectionService } from '../../../store/admin-users';

@Injectable()
export class AdminUserListService {
  private _nextToken?: string;
  private _working = false;

  constructor(
    private _adminUserCollectionService: AdminUserCollectionService,
  ) {}

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working) {
      this._working = true;

      this._adminUserCollectionService
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
