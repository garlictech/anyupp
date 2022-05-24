import { take } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { Pipe, PipeTransform } from '@angular/core';
import { loggedUserSelectors } from '../../../store/logged-user';
import { DEFAULT_LANG } from '../../../shared/utils';
import { select, Store } from '@ngrx/store';

@Pipe({
  name: 'localize',
  pure: false,
})
export class LocalizePipe implements PipeTransform {
  constructor(private _store: Store) {}

  transform(value: CrudApi.LocalizedItem | null | undefined): string {
    if (!value) {
      return '';
    }

    let selectedLang = undefined;
    this._store
      .pipe(select(loggedUserSelectors.getSelectedLanguage), take(1))
      .subscribe((lang: string | null | undefined) => {
        selectedLang = (lang || DEFAULT_LANG).substr(0, 2);
      });

    return selectedLang
      ? value[selectedLang]
      : value.en
      ? value.en
      : Object.values(value).filter(
          (v: string): boolean => typeof v === 'string' && v.length > 0,
        )[0] || '';
  }
}
