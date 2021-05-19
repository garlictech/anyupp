import { Observable } from 'rxjs';

import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { roleContextsSelectors } from '@bgap/admin/shared/data-access/role-contexts';
import { IRoleContext } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { RoleContextFormComponent } from '../role-context-form/role-context-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-role-context-list',
  templateUrl: './role-context-list.component.html',
  styleUrls: ['./role-context-list.component.scss'],
})
export class RoleContextListComponent implements OnDestroy {
  public roleContexts$: Observable<IRoleContext[]>;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _nbDialogService: NbDialogService,
  ) {
    this.roleContexts$ = this._store.pipe(
      select(roleContextsSelectors.getAllRoleContexts),
      untilDestroyed(this),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  addRoleContext(): void {
    this._nbDialogService.open(RoleContextFormComponent);
  }
}
