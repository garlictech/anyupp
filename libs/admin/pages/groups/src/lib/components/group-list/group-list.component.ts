import { Observable } from 'rxjs';

import { Component, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { IChain, IGroup } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { GroupFormComponent } from '../group-form/group-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnDestroy {
  public groups$: Observable<IGroup[]>;
  public chains$: Observable<IChain[]>;
  public selectedChainId$: Observable<string | undefined | null>;

  constructor(
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
  ) {
    this.groups$ = this._store.pipe(
      select(groupsSelectors.getAllGroups),
      untilDestroyed(this)
    );
    this.chains$ = this._store.pipe(
      select(chainsSelectors.getAllChains),
      untilDestroyed(this)
    );
    this.selectedChainId$ = this._store.pipe(
      select(loggedUserSelectors.getSelectedChainId),
      untilDestroyed(this)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addGroup(): void {
    this._nbDialogService.open(GroupFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }
}
