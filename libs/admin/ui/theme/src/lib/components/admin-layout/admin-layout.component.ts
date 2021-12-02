import { debounceTime } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { environment } from '@bgap/admin/shared/config';
import { MENU_ROLES } from '@bgap/admin/shared/utils';
import {} from '@bgap/shared/types';
import { NbMenuItem } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { filterNullish } from '@bgap/shared/utils';
import { combineLatest } from 'rxjs';

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
  productModifiers: {
    title: 'menu.modifiersAndExtras',
    icon: 'pantone-outline',
    link: '/admin/modifiers-and-extras',
    roles: MENU_ROLES.MODIFIERS_AND_EXTRAS,
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
  public adminUser?: CrudApi.AdminUser;
  public env = environment;
  public menu: NbMenuItem[] = [];

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._store
        .select(loggedUserSelectors.getLoggedUserRole)
        .pipe(filterNullish()),
      this._store
        .select(loggedUserSelectors.getLoggedUser)
        .pipe(filterNullish()),
    ])
      .pipe(
        debounceTime(10), // Language reload!
        untilDestroyed(this),
      )
      .subscribe(([role, adminUser]) => {
        this.adminUser = adminUser;

        this.menu = [];
        Object.values(menuItems).forEach((menuItem): void => {
          if (menuItem.roles.includes(role || CrudApi.Role.inactive)) {
            this.menu.push({
              ...menuItem,
              title: this._translateService.instant(menuItem.title),
            });
          }
        });

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public reloadWindow(): void {
    window.location.reload();
  }
}
