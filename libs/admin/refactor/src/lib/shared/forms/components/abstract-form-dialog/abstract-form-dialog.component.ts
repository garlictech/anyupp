import { appCoreActions, appCoreSelectors } from '../../../../store/app-core';

import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from '../../../../shared/data-access/data';
import { ToasterService } from '../../../../shared/utils';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of } from 'rxjs';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-abstract-form-dialog',
  template: '',
})
export class AbstractFormDialogComponent {
  public dialogForm?: FormGroup;
  public working$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  protected _dataService: DataService;
  protected _formBuilder: FormBuilder;
  protected _toasterService: ToasterService;
  protected _store: Store;
  private _nbDialogRef: NbDialogRef<unknown>;

  constructor(protected _injector: Injector) {
    this._nbDialogRef = this._injector.get(NbDialogRef);
    this._dataService = this._injector.get(DataService);
    this._formBuilder = this._injector.get(FormBuilder);
    this._toasterService = this._injector.get(ToasterService);
    this._store = this._injector.get(Store);

    this._store
      .select(appCoreSelectors.getClosableDialog)
      .pipe(untilDestroyed(this))
      .subscribe((closable: boolean) => {
        if (closable) {
          this.close();

          this._store.dispatch(
            appCoreActions.setClosableDialog({ closableDialog: false }),
          );
        }
      });
  }

  public close() {
    this._nbDialogRef.close();
  }

  public setWorking$(working: boolean) {
    return of(this.working$.next(working));
  }
}
