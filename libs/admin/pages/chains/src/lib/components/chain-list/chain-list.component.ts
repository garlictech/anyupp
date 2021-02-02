import { Observable } from 'rxjs';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { IChain } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ChainFormComponent } from '../chain-form/chain-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-chain-list',
  templateUrl: './chain-list.component.html',
  styleUrls: ['./chain-list.component.scss'],
})
export class ChainListComponent implements OnInit, OnDestroy {
  public chains$: Observable<IChain[]>;

  constructor(
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.chains$ = this._store.pipe(
      select(chainsSelectors.getAllChains),
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
