import { fromEvent, Observable } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdminUser } from '@bgap/domain';
import {
  NbDialogService,
  NbMenuService,
  NbSidebarService,
} from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '../../../../shared/components';
import { CognitoService } from '../../../../shared/data-access/auth';
import { DataService } from '../../../../shared/data-access/data';
import { DEFAULT_LANG } from '../../../../shared/utils';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { LayoutService } from '../../../../ui/core';

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
export class HeaderComponent implements OnInit {
  public loggedUser?: AdminUser;
  public userPictureOnly = false;
  public userMenu: IMenuItem[];
  public languageMenu: IMenuItem[];
  public selectedLang: string;
  public networkError$: Observable<string>;
  public compacted = true;

  constructor(
    private _store: Store,
    private _sidebarService: NbSidebarService,
    private _menuService: NbMenuService,
    private _layoutService: LayoutService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
    private _cognitoService: CognitoService,
    private _translateService: TranslateService,
    private _nbDialogService: NbDialogService,
    private _router: Router,
    private _ngZone: NgZone,
  ) {
    this.selectedLang = DEFAULT_LANG.split('-')[0];
    this.networkError$ = fromEvent(window, 'offline').pipe(
      take(1),
      untilDestroyed(this),
      map(() => new Date().toLocaleTimeString()),
    );

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
    return this.loggedUser?.name;
  }

  get userImage(): string | undefined | null {
    return this.loggedUser?.profileImage;
  }

  ngOnInit() {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe(adminUser => {
        this.loggedUser = adminUser;

        this._changeDetectorRef.detectChanges();
      });

    this._translateService.onLangChange.subscribe(
      (event: LangChangeEvent): void => {
        this.selectedLang = (event.lang || '').split('-')[0];
        this._translateMenuItems();

        this._changeDetectorRef.detectChanges();
      },
    );

    this._sidebarService
      .onToggle()
      .pipe(
        map(data => data.compact),
        startWith(true),
        untilDestroyed(this),
      )
      .subscribe(compacted => {
        this.compacted = compacted;

        this._changeDetectorRef.detectChanges();
      });

    this._translateMenuItems();

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
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'auth.confirmLogout',
      buttons: [
        {
          label: 'common.ok',
          callback: async (): Promise<void> => {
            this._cognitoService.signOut().subscribe(() => {
              this._ngZone.run(() => {
                this._router.navigate(['auth/login']);
              });
            });
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          status: 'basic',
        },
      ],
    };
  }

  public toggleSidebar($event: Event) {
    $event.preventDefault();

    this._sidebarService.toggle(!this.compacted, 'menu-sidebar');
    this._layoutService.changeLayoutSize();

    this._changeDetectorRef.detectChanges();
  }

  public navigateHome(): boolean {
    this._menuService.navigateHome();

    return false;
  }

  private _onLanguageSelected(lang: string): void {
    if (
      this.loggedUser?.id &&
      lang !== this.loggedUser?.settings?.selectedLanguage
    ) {
      this._dataService
        .updateAdminUserSettings$(this.loggedUser.id, {
          ...(this.loggedUser?.settings || {}),
          selectedLanguage: lang,
        })
        .subscribe();
    }
  }

  public reloadWindow(): void {
    window.location.reload();
  }
}
