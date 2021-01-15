
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export class UpdateAdminUserInput {
    email?: string;
    name?: string;
    phone?: string;
}

export class AdminUser {
    __typename?: 'AdminUser';
    email?: string;
    name?: string;
    phone?: string;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract hello(): string | Promise<string>;

    abstract getAdminUser(id: string): AdminUser | Promise<AdminUser>;
}

export abstract class ISubscription {
    __typename?: 'ISubscription';

    abstract adminUserChanged(id: string): AdminUser | Promise<AdminUser>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract updateAdminUser(id: string, newAdminData: UpdateAdminUserInput): boolean | Promise<boolean>;
}
