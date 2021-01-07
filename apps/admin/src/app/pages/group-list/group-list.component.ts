import { Observable } from 'rxjs';
import { IChain, IGroup } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import {
  chainListSelectors,
  currentUserSelectors,
  groupListSelectors,
} from 'src/app/store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { GroupFormComponent } from './components/group-form/group-form.component';

@UntilDestroy()
@Component({
  selector: 'app-group-list',
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
