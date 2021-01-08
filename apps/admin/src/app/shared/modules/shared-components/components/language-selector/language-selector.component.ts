import { get as _get } from 'lodash-es';
import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { IAdminUser } from '../../../../interfaces';
import { DataService } from '../../../../services/data';
import { IState } from '../../../../../store';
import { currentUserSelectors } from '../../../../../store/selectors';

@UntilDestroy()
@Component({
  selector: 'bgap-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnDestroy {
  private _adminUser: IAdminUser;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService
  ) {
    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });
  }

  get selectedLanguage(): string {
    return _get(this._adminUser, 'settings.selectedLanguage');
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onLanguageSelected(lang: string): void {
    /* TODO FROM AdminUserCredentials !!!
    if (
      _get(this._adminUser, '_id') &&
      lang !== this._adminUser.settings.selectedLanguage
    ) {
      this._dataService.updateAdminUserSeletedLanguage(
        this._adminUser._id,
        lang
      );
    }
    */
  }
}
