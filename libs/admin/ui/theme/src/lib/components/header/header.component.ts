import { ConfirmDialogComponent } from 'libs/admin/shared/components/src';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { CognitoService } from '@bgap/admin/shared/data-access/auth';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { DEFAULT_LANG } from '@bgap/admin/shared/utils';
import { LayoutService } from '@bgap/admin/ui/core';
import { IAdminUser, IGroup } from '@bgap/shared/types';
import {
  NbDialogService,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

interface IMenuItem {
  title: string;
  langKey: string;
  onClick?(): void;
}

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public groups$?: Observable<IGroup[]>;
  public adminUser?: IAdminUser;
  public userPictureOnly = false;
  public userMenu: IMenuItem[];
  public languageMenu: IMenuItem[];
  public selectedLang: string;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _sidebarService: NbSidebarService,
    private _menuService: NbMenuService,
    private _themeService: NbThemeService,
    private _layoutService: LayoutService,
    private _breakpointService: NbMediaBreakpointsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
    private _cognitoService: CognitoService,
    private _translateService: TranslateService,
    private _nbDialogService: NbDialogService,
    private _router: Router,
    private _ngZone: NgZone,
  ) {
    this.selectedLang = DEFAULT_LANG.split('-')[0];

    this.userMenu = [
      {
        title: 'Profile',
        langKey: 'header.profile',
      },
      {
        title: 'Log out',
        langKey: 'header.logout',
        onClick: (): void => {
          this._signOut();
        },
      },
    ];

    this.languageMenu = [
      {
        title: 'Magyar',
        langKey: 'common.lang.hungarian',
        onClick: (): void => {
          this._onLanguageSelected('hu-HU');
        },
      },
      {
        title: 'English',
        langKey: 'common.lang.english',
        onClick: (): void => {
          this._onLanguageSelected('en-US');
        },
      },
      {
        title: 'German',
        langKey: 'common.lang.german',
        onClick: (): void => {
          this._onLanguageSelected('de-DE');
        },
      },
    ];
  }

  get userName(): string | undefined {
    return this.adminUser?.name;
  }

  get userImage(): string | undefined | null {
    return this.adminUser?.profileImage;
  }

  ngOnInit(): void {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this.adminUser = adminUser;

        this._changeDetectorRef.detectChanges();
      });

    this._translateService.onLangChange.subscribe(
      (event: LangChangeEvent): void => {
        this.selectedLang = (event.lang || '').split('-')[0];
        this._translateMenuItems();
      },
    );
    this._translateMenuItems();

    const { xl } = this._breakpointService.getBreakpointsMap();
    this._themeService
      .onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]): boolean => currentBreakpoint.width < xl),
        untilDestroyed(this),
      )
      .subscribe((isLessThanXl: boolean): boolean => {
        this._changeDetectorRef.detectChanges();

        return (this.userPictureOnly = isLessThanXl);
      });

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

    this._changeDetectorRef.detectChanges();
  }

  private _signOut() {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.options = {
      message: 'auth.confirmLogout',
      buttons: [
        {
          label: 'common.ok',
          callback: async (): Promise<void> => {
            this._cognitoService.signOut().subscribe(() => {
              this._ngZone.run(() => {
                this._router.navigate(['admin/dashboard']);
              });
            });
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {
            /**/
          },
          status: 'basic',
        },
      ],
    };
  }

  public toggleSidebar(): boolean {
    this._sidebarService.toggle(true, 'menu-sidebar');
    this._layoutService.changeLayoutSize();

    this._changeDetectorRef.detectChanges();

    return false;
  }

  public navigateHome(): boolean {
    this._menuService.navigateHome();

    return false;
  }

  private _onLanguageSelected(lang: string): void {
    if (
      this.adminUser?.id &&
      lang !== this.adminUser?.settings?.selectedLanguage
    ) {
      this._dataService.updateAdminUserSeletedLanguage(
        this.adminUser?.id || '',
        lang,
      );
    }
  }
}
