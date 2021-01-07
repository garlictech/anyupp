import { get as _get } from 'lodash-es';
import { IAdminUser } from 'src/app/shared/interfaces';
import { DataService } from 'src/app/shared/services/data';
import { IState } from 'src/app/store';
import { currentUserSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
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
    if (
      _get(this._adminUser, '_id') &&
      lang !== this._adminUser.settings.selectedLanguage
    ) {
      this._dataService.updateAdminUserSeletedLanguage(
        this._adminUser._id,
        lang
      );
    }
  }
}
