import { debounceTime, map, take } from 'rxjs/operators';

import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@bgap/admin/shared/config';
import { MENU_ROLES } from '@bgap/admin/shared/utils';
import { appCoreSelectors } from '@bgap/admin/store/app-core';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import {} from '@bgap/shared/types';
import { filterNullish } from '@bgap/shared/utils';
import { NbMenuItem } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const menuItems = {
  dashboard: {
    title: 'menu.dashboard',
    icon: { icon: 'home', pack: 'material-icons' },
    link: '/admin/dashboard',
    home: true,
    roles: MENU_ROLES.DASHBOARD,
  },
  products: {
    title: 'menu.products',
    icon: { icon: 'book', pack: 'material-icons' },
    link: '/admin/products',
    roles: MENU_ROLES.PRODUCTS,
  },
  productCategories: {
    title: 'menu.productCategories',
    icon: { icon: 'local_bar', pack: 'material-icons' },
    link: '/admin/product-categories',
    roles: MENU_ROLES.PRODUCT_CATEGORIES,
  },
  productModifiers: {
    title: 'menu.modifiersAndExtras',
    icon: { icon: 'domain', pack: 'material-icons' },
    link: '/admin/modifiers-and-extras',
    roles: MENU_ROLES.MODIFIERS_AND_EXTRAS,
  },
  units: {
    title: 'menu.units',
    icon: { icon: 'store', pack: 'material-icons' },
    link: '/admin/units',
    roles: MENU_ROLES.UNITS,
  },
  groups: {
    title: 'menu.groups',
    icon: { icon: 'group_work', pack: 'material-icons' },
    link: '/admin/groups',
    roles: MENU_ROLES.GROUPS,
  },
  chains: {
    title: 'menu.chains',
    icon: { icon: 'stars', pack: 'material-icons' },
    link: '/admin/chains',
    roles: MENU_ROLES.CHAINS,
  },
  /*
  users: {
    title: 'menu.users',
    icon: { icon: 'people', pack: 'material-icons' },
    link: '/admin/users',
    roles: MENU_ROLES.USERS,
  },
  */
  admins: {
    title: 'menu.admins',
    icon: { icon: 'people', pack: 'material-icons' },
    link: '/admin/admins',
    roles: MENU_ROLES.ADMINS,
  },
  /*
  roleContexts: {
    title: 'menu.roleContexts',
    icon: { icon: 'verified_user_outline', pack: 'material-icons' },
    link: '/admin/role-contexts',
    roles: MENU_ROLES.ROLE_CONTEXTS,
  },
  */
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
