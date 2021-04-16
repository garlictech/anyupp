import { debounceTime, filter } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { environment } from '@bgap/admin/shared/config';
import { MENU_ROLES } from '@bgap/admin/shared/utils';
import { EAdminRole, IAdminUser } from '@bgap/shared/types';
import { NbMenuItem } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const menuItems = {
  dashboard: {
    title: 'menu.dashboard',
    icon: 'home-outline',
    link: '/admin/dashboard',
    home: true,
    roles: MENU_ROLES.DASHBOARD,
  },
  products: {
    title: 'menu.products',
    icon: 'cube-outline',
    link: '/admin/products',
    roles: MENU_ROLES.PRODUCTS,
  },
  productCategories: {
    title: 'menu.productCategories',
    icon: 'grid-outline',
    link: '/admin/product-categories',
    roles: MENU_ROLES.PRODUCT_CATEGORIES,
  },
  units: {
    title: 'menu.units',
    icon: 'home-outline',
    link: '/admin/units',
    roles: MENU_ROLES.UNITS,
  },
  groups: {
    title: 'menu.groups',
    icon: 'globe-outline',
    link: '/admin/groups',
    roles: MENU_ROLES.GROUPS,
  },
  chains: {
    title: 'menu.chains',
    icon: 'flag-outline',
    link: '/admin/chains',
    roles: MENU_ROLES.CHAINS,
  },
  users: {
    title: 'menu.users',
    icon: 'people-outline',
    link: '/admin/users',
    roles: MENU_ROLES.USERS,
  },
  admins: {
    title: 'menu.admins',
    icon: 'person-outline',
    link: '/admin/admins',
    roles: MENU_ROLES.ADMINS,
  },
  roleContexts: {
    title: 'menu.roleContexts',
    icon: 'shield-outline',
    link: '/admin/role-contexts',
    roles: MENU_ROLES.ROLE_CONTEXTS,
  },
};

@UntilDestroy()
@Component({
  selector: 'bgap-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public adminUser?: IAdminUser;
  public env = environment;
  public menu: NbMenuItem[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _translateService: TranslateService,
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUser),
        filter((adminUser): boolean => !!adminUser),
        debounceTime(10), // Language reload!
        untilDestroyed(this),
      )
      .subscribe((adminUser: IAdminUser): void => {
        this.adminUser = adminUser;

        this.menu = [];
        Object.values(menuItems).forEach((menuItem): void => {
          /*if ( TODO use roleContext check
            menuItem.roles.includes(
              this.adminUser?.roles?.role || EAdminRole.INACTIVE,
            )
          ) {*/
          this.menu.push({
            ...menuItem,
            title: this._translateService.instant(menuItem.title),
          });
          // }
        });
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public reloadWindow(): void {
    window.location.reload();
  }
}
