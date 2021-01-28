import { Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IChain, IGroup } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import {
  chainListSelectors,
  currentUserSelectors,
  groupListSelectors,
} from '../../store/selectors';
import { GroupFormComponent } from './components/group-form/group-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-group-list',
  templateUrl: './group-list.component.html',
})
export class GroupListComponent implements OnInit, OnDestroy {
  public groups$: Observable<IGroup[]>;
  public chains$: Observable<IChain[]>;
  public selectedChainId$: Observable<string>;

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.groups$ = this._store.pipe(
      select(groupListSelectors.getAllGroups),
      untilDestroyed(this)
    );
    this.chains$ = this._store.pipe(
      select(chainListSelectors.getAllChains),
      untilDestroyed(this)
    );
    this.selectedChainId$ = this._store.pipe(
      select(currentUserSelectors.getSelectedChainId),
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
