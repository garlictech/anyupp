import { get as _get } from 'lodash-es';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IAdminUser, IGroup } from '../../../shared/interfaces';
import { IState } from '../../../store';
import { currentUserSelectors } from '../../../store/selectors';

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../../@core/utils';
import { DataService } from '../../../shared/services/data';
import { AuthService } from '../../../shared/services/auth';
import { DEFAULT_LANG } from '../../../shared/const';

interface IMenuItem {
  title: string;
  langKey: string;
  onClick?(): void;
}

@UntilDestroy()
@Component({
  selector: 'bgap-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public groups$: Observable<IGroup[]>;
  public adminUser: IAdminUser;
  public userPictureOnly = false;
  public userMenu: IMenuItem[];
  public languageMenu: IMenuItem[];
  public selectedLang: string;

  constructor(
    private _store: Store<IState>,
    private _sidebarService: NbSidebarService,
    private _menuService: NbMenuService,
    private _themeService: NbThemeService,
    private _layoutService: LayoutService,
    private _breakpointService: NbMediaBreakpointsService,
    private _authService: AuthService,
    private _dataService: DataService,
    private _translateService: TranslateService
  ) {
    this.selectedLang = DEFAULT_LANG.split('-')[0];

    this.userMenu = [
      {
        title: 'Profile',
        langKey: 'header.profile'
      },
      {
        title: 'Log out',
        langKey: 'header.logout',
        onClick: (): void => {
          this._authService.signOut();
        }
      }
    ];

    this.languageMenu = [
      {
        title: 'Magyar',
        langKey: 'common.lang.hungarian',
        onClick: (): void => {
          this._onLanguageSelected('hu-HU');
        }
      },
      {
        title: 'English',
        langKey: 'common.lang.english',
        onClick: (): void => {
          this._onLanguageSelected('en-US');
        }
      },
      {
        title: 'German',
        langKey: 'common.lang.german',
        onClick: (): void => {
          this._onLanguageSelected('de-DE');
        }
      }
    ];

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this.adminUser = adminUser;
      });

    this._translateService.onLangChange.subscribe((event): void => {
      this.selectedLang = _get(event, 'lang', '').split('-')[0];
      this._translateMenuItems();
    });
    this._translateMenuItems();
  }

  get userName(): string {
    return _get(this.adminUser, 'name');
  }

  get userImage(): string {
    return _get(this.adminUser, 'profileImage');
  }

  ngOnInit(): void {
    const { xl } = this._breakpointService.getBreakpointsMap();
    this._themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]): boolean => currentBreakpoint.width < xl),
        untilDestroyed(this)
      )
      .subscribe(
        (isLessThanXl: boolean): boolean =>
          (this.userPictureOnly = isLessThanXl)
      );

    this._menuService
      .onItemClick()
      .pipe(untilDestroyed(this))
      // Nebular theme wrong interface, menu item does not have "onClick" property
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((menu: any): void => {
        if (menu.item.onClick) {
          menu.item.onClick();
        }
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _translateMenuItems(): void {
    this.userMenu.forEach((item): void => {
      item.title = this._translateService.instant(item.langKey);
    });

    this.languageMenu.forEach((item): void => {
      item.title = this._translateService.instant(item.langKey);
    });
  }

  public toggleSidebar(): boolean {
    this._sidebarService.toggle(true, 'menu-sidebar');
    this._layoutService.changeLayoutSize();

    return false;
  }

  public navigateHome(): boolean {
    this._menuService.navigateHome();

    return false;
  }

  private _onLanguageSelected(lang: string): void {
    if (
      _get(this.adminUser, '_id') &&
      lang !== _get(this.adminUser, 'settings.selectedLanguage')
    ) {
      this._dataService.updateAdminUserSeletedLanguage(
        this.adminUser._id,
        lang
      );
    }
  }
}
