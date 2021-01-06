
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
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
