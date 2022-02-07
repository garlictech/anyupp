import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { GroupFormComponent } from '../group-form/group-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnDestroy {
  public groups$: Observable<CrudApi.Group[]>;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {
    this.groups$ = combineLatest([
      this._store.pipe(select(groupsSelectors.getAllGroups)),
      this._store.pipe(select(loggedUserSelectors.getSelectedChainId)),
    ]).pipe(
      map(
        ([groups, selectedChainId]: [
          CrudApi.Group[],
          string | null | undefined,
        ]) => groups.filter(g => g.chainId === selectedChainId),
      ),
      untilDestroyed(this),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addGroup(): void {
    this._nbDialogService.open(GroupFormComponent);
  }
}
