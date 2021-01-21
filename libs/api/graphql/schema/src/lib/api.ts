
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

export class CreateAdminUserInput {
    email?: string;
    name?: string;
    phone?: string;
}

export class AdminUser {
    __typename?: 'AdminUser';
    id: string;
    name?: string;
    profileImage?: string;
    roles: AdminUserRole;
    settings?: AdminUserSettings;
    address?: Address;
    email?: string;
    phone?: string;
}

export class AdminUserRole {
    __typename?: 'AdminUserRole';
    role: string;
    entities?: AdminRoleEntity[];
}

export class AdminRoleEntity {
    __typename?: 'AdminRoleEntity';
    chainId?: string;
    groupId?: string;
    unitId?: string;
}

export class AdminUserSettings {
    __typename?: 'AdminUserSettings';
    selectedChainId?: string;
    selectedGroupId?: string;
    selectedUnitId?: string;
    selectedProductCategoryId?: string;
    selectedLanguage?: string;
    selectedHistoryDate?: number;
}

export abstract class IQuery {
    __typename?: 'IQuery';

    abstract getAdminUser(id: string): AdminUser | Promise<AdminUser>;
}

export abstract class ISubscription {
    __typename?: 'ISubscription';

    abstract adminUserChanged(id: string): AdminUser | Promise<AdminUser>;
}

export abstract class IMutation {
    __typename?: 'IMutation';

    abstract updateAdminUser(id: string, newAdminData: UpdateAdminUserInput): boolean | Promise<boolean>;

    abstract createAdminUser(newAdminData: CreateAdminUserInput): boolean | Promise<boolean>;
}

export class Chain {
    __typename?: 'Chain';
    id: string;
    name?: string;
    description?: LocalizedItem;
    style?: ChainStyle;
    isActive?: boolean;
}

export class ChainStyle {
    __typename?: 'ChainStyle';
    colors?: ChainStyleColors;
    images?: ChainStyleImages;
}

export class ChainStyleColors {
    __typename?: 'ChainStyleColors';
    backgroundLight?: string;
    backgroundDark?: string;
    borderLight?: string;
    borderDark?: string;
    disabled?: string;
    highlight?: string;
    indicator?: string;
    textLight?: string;
    textDark?: string;
}

export class ChainStyleImages {
    __typename?: 'ChainStyleImages';
    header?: string;
    logo?: string;
}

export class Address {
    __typename?: 'Address';
    address?: string;
    city?: string;
    country?: string;
    title?: string;
    postalCode?: string;
    location?: Location;
}

export class Location {
    __typename?: 'Location';
    lat?: number;
    lng?: number;
}

export class LocalizedItem {
    __typename?: 'LocalizedItem';
    en?: string;
    de?: string;
    hu?: string;
}

export class DailySchedule {
    __typename?: 'DailySchedule';
    from?: string;
    to?: string;
}

export class CustomDailySchedule {
    __typename?: 'CustomDailySchedule';
    date?: string;
    from?: string;
    to?: string;
}

export class WeeklySchedule {
    __typename?: 'WeeklySchedule';
    mon?: DailySchedule;
    tue?: DailySchedule;
    wed?: DailySchedule;
    thu?: DailySchedule;
    fri?: DailySchedule;
    sat?: DailySchedule;
    sun?: DailySchedule;
    override?: CustomDailySchedule[];
}

export class Group {
    __typename?: 'Group';
    id: string;
    chainId: string;
    name?: string;
    description?: LocalizedItem;
    currency?: string;
    address?: Address;
    email?: string;
    phone?: string;
}

export class Order {
    __typename?: 'Order';
    created?: number;
    items?: OrderItem[];
    paymentMethod?: string;
    staffId?: string;
    statusLog?: StatusLog[];
    sumPriceShown?: PriceShown;
    takeAway?: boolean;
    userId?: string;
    place?: Place;
    paymentIntention?: number;
}

export class OrderItem {
    __typename?: 'OrderItem';
    created?: number;
    productName?: LocalizedItem;
    priceShown?: PriceShown;
    productId?: string;
    quantity?: number;
    statusLog?: StatusLog[];
    variantId?: string;
    variantName?: LocalizedItem;
    laneId?: string;
}

export class StatusLog {
    __typename?: 'StatusLog';
    userId?: string;
    status?: string;
    ts?: number;
}

export class PriceShown {
    __typename?: 'PriceShown';
    currency?: string;
    pricePerUnit?: number;
    priceSum?: number;
    tax?: number;
    taxSum?: number;
}

export class Place {
    __typename?: 'Place';
    seat?: string;
    table?: string;
}

export class ProductCategory {
    __typename?: 'ProductCategory';
    id?: string;
    description?: LocalizedItem;
    image?: string;
    name?: LocalizedItem;
    position?: string;
}

export class ChainProduct {
    __typename?: 'ChainProduct';
    id: string;
    description?: LocalizedItem;
    extends?: string;
    image?: string;
    isVisible?: boolean;
    tax?: number;
    name?: LocalizedItem;
    position?: string;
    productCategoryId?: string;
    laneId?: string;
    productType?: string;
    variants?: ProductVariant[];
}

export class ProductVariant {
    __typename?: 'ProductVariant';
    variantName?: LocalizedItem;
    pack?: ProductVariantPack;
    refGroupPrice?: number;
    isAvailable?: boolean;
    price?: number;
    availabilities?: Availability[];
    availableFrom?: string;
    position?: string;
}

export class ProductVariantPack {
    __typename?: 'ProductVariantPack';
    size?: number;
    unit?: string;
}

export class Availability {
    __typename?: 'Availability';
    type?: string;
    dayFrom?: string;
    dayTo?: string;
    timeFrom?: string;
    timeTo?: string;
    price?: number;
}

export class Unit {
    __typename?: 'Unit';
    id: string;
    groupId: string;
    isActive?: boolean;
    isAcceptingOrders?: boolean;
    name?: string;
    description?: LocalizedItem;
    paymentModes?: PaymentMode[];
    floorMap?: FloorMapData;
    lanes?: Lane[];
    open?: DailySchedule;
    openingHours?: WeeklySchedule;
}

export class PaymentMode {
    __typename?: 'PaymentMode';
    name: string;
    caption?: string;
    method: string;
}

export class FloorMapData {
    __typename?: 'FloorMapData';
    w?: number;
    h?: number;
    objects?: FloorMapDataObject[];
}

export class FloorMapDataObject {
    __typename?: 'FloorMapDataObject';
    id: string;
    t: string;
    c?: string;
    w?: number;
    h?: number;
    r?: number;
    a?: number;
    x: number;
    y: number;
    tID?: string;
    sID?: string;
}

export class Lane {
    __typename?: 'Lane';
    id?: string;
    name?: string;
    color?: string;
}

export class User {
    __typename?: 'User';
    id: string;
    name?: string;
    address?: Address;
    email?: string;
    phone?: string;
    profileImage?: string;
    login?: string;
}
