import { get as _get } from 'lodash-es';
import { debounceTime, filter } from 'rxjs/operators';
import { IAdminUser } from '@bgap/shared/types';
import { IState } from '../../../store';
import { currentUserSelectors } from '../../../store/selectors';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { MENU_ROLES } from '../../../shared/const';
import { environment } from '../../../../environments/environment';

const menuItems = {
  dashboard: {
    title: 'menu.dashboard',
    icon: 'home-outline',
    link: '/admin/dashboard',
    home: true,
    roles: MENU_ROLES.DASHBOARD
  },
  products: {
    title: 'menu.products',
    icon: 'cube-outline',
    link: '/admin/products',
    roles: MENU_ROLES.PRODUCTS
  },
  productCategories: {
    title: 'menu.productCategories',
    icon: 'grid-outline',
    link: '/admin/product-categories',
    roles: MENU_ROLES.PRODUCT_CATEGORIES
  },
  units: {
    title: 'menu.units',
    icon: 'home-outline',
    link: '/admin/units',
    roles: MENU_ROLES.UNITS
  },
  groups: {
    title: 'menu.groups',
    icon: 'globe-outline',
    link: '/admin/groups',
    roles: MENU_ROLES.GROUPS
  },
  chains: {
    title: 'menu.chains',
    icon: 'shield-outline',
    link: '/admin/chains',
    roles: MENU_ROLES.CHAINS
  },
  users: {
    title: 'menu.users',
    icon: 'people-outline',
    link: '/admin/users',
    roles: MENU_ROLES.USERS
  },
  admins: {
    title: 'menu.admins',
    icon: 'person-outline',
    link: '/admin/admins',
    roles: MENU_ROLES.ADMINS
  }
};

@UntilDestroy()
@Component({
  selector: 'bgap-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  public adminUser: IAdminUser;
  public env = environment;
  public menu: NbMenuItem[] = [];

  constructor(
    private _store: Store<any>,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(currentUserSelectors.getAdminUser),
        filter((adminUser): boolean => !!adminUser),
        debounceTime(10), // Language reload!
        untilDestroyed(this)
      )
      .subscribe((adminUser: IAdminUser): void => {
        this.adminUser = adminUser;

        this.menu = [];
        Object.values(menuItems).forEach((menuItem): void => {
          if (menuItem.roles.includes(_get(this.adminUser, 'roles.role'))) {
            this.menu.push({
              ...menuItem,
              title: this._translateService.instant(menuItem.title)
            });
          }
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
