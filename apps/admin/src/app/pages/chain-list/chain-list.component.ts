import { Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IChain } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { IState } from '../../store';
import { chainListSelectors } from '../../store/selectors';
import { ChainFormComponent } from './components/chain-form/chain-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-chain-list',
  templateUrl: './chain-list.component.html',
})
export class ChainListComponent implements OnInit, OnDestroy {
  public chains$: Observable<IChain[]>;

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.chains$ = this._store.pipe(
      select(chainListSelectors.getAllChains),
      untilDestroyed(this)
    );
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addChain(): void {
    this._nbDialogService.open(ChainFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }
}
