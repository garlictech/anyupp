import { debounceTime, map, take } from 'rxjs/operators';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@bgap/admin/shared/config';
import { appCoreSelectors } from '@bgap/admin/store/app-core';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import {} from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';
import { NbMenuItem } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

const menuItems = {
  dashboard: {
    title: 'menu.dashboard',
    icon: { icon: 'home', pack: 'material-icons' },
    link: '/admin/dashboard',
    home: true,
  },
  products: {
    title: 'menu.products',
    icon: { icon: 'book', pack: 'material-icons' },
    link: '/admin/products',
  },
  productCategories: {
    title: 'menu.productCategories',
    icon: { icon: 'local_bar', pack: 'material-icons' },
    link: '/admin/product-categories',
  },
  productModifiers: {
    title: 'menu.modifiersAndExtras',
    icon: { icon: 'domain', pack: 'material-icons' },
    link: '/admin/modifiers-and-extras',
  },
  units: {
    title: 'menu.units',
    icon: { icon: 'store', pack: 'material-icons' },
    link: '/admin/units',
  },
  groups: {
    title: 'menu.groups',
    icon: { icon: 'group_work', pack: 'material-icons' },
    link: '/admin/groups',
  },
  chains: {
    title: 'menu.chains',
    icon: { icon: 'stars', pack: 'material-icons' },
    link: '/admin/chains',
  },
  admins: {
    title: 'menu.admins',
    icon: { icon: 'people', pack: 'material-icons' },
    link: '/admin/admins',
  },
};

@UntilDestroy()
@Component({
  selector: 'bgap-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public adminUser?: CrudApi.AdminUser;
  public env = environment;
  public menu: NbMenuItem[] = [];

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _router: Router,
  ) {}

  ngOnInit() {
    this._store
      .select(loggedUserSelectors.getLoggedUser)
      .pipe(
        filterNullish(),
        debounceTime(10), // Language reload!
        untilDestroyed(this),
      )
      .subscribe(adminUser => {
        this.adminUser = adminUser;
        this.menu = [];

        Object.values(menuItems).forEach(async menuItem => {
          if (await this._allowAddMenu(adminUser, menuItem.title)) {
            this.menu.push({
              ...menuItem,
              title: this._translateService.instant(menuItem.title),
              selected: this._router.url.includes(menuItem.link),
            });
          }
        });

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy() {
    // untilDestroyed uses it.
  }

  public reloadWindow() {
    window.location.reload();
  }

  private async _allowAddMenu(
    adminUser: CrudApi.AdminUser,
    menuItemTitle: string,
  ) {
    if (menuItemTitle !== 'menu.admins') {
      return true;
    }

    return await this._store
      .select(appCoreSelectors.getChainRestrictionsByUserId(adminUser?.id))
      .pipe(
        map(restrictions => restrictions.length === 0),
        take(1),
      )
      .toPromise();
  }
}
