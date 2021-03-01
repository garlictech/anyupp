import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export enum CardBrand {
  AMEX = "amex",
  DINERS = "diners",
  DISCOVER = "discover",
  JCB = "jcb",
  MASTERCARD = "mastercard",
  UNIONPAY = "unionpay",
  VISA = "visa",
  UNKNOWN = "unknown"
}

export enum CardFundingType {
  CREDIT = "credit",
  DEBIT = "debit",
  PREPAID = "prepaid",
  UNKNOWN = "unknown"
}

export declare class AdminUserRole {
  readonly role: string;
  readonly entities?: (AdminRoleEntity | null)[];
  constructor(init: ModelInit<AdminUserRole>);
}

export declare class AdminRoleEntity {
  readonly chainId?: string;
  readonly groupId?: string;
  readonly unitId?: string;
  constructor(init: ModelInit<AdminRoleEntity>);
}

export declare class AdminUserSettings {
  readonly selectedChainId?: string;
  readonly selectedGroupId?: string;
  readonly selectedUnitId?: string;
  readonly selectedProductCategoryId?: string;
  readonly selectedLanguage?: string;
  readonly selectedHistoryDate?: number;
  constructor(init: ModelInit<AdminUserSettings>);
}

export declare class Address {
  readonly address?: string;
  readonly city?: string;
  readonly country?: string;
  readonly title?: string;
  readonly postalCode?: string;
  readonly location?: Location;
  constructor(init: ModelInit<Address>);
}

export declare class Location {
  readonly lat?: number;
  readonly lng?: number;
  constructor(init: ModelInit<Location>);
}

export declare class LocalizedItem {
  readonly en?: string;
  readonly de?: string;
  readonly hu?: string;
  constructor(init: ModelInit<LocalizedItem>);
}

export declare class CardChecks {
  readonly address_line1_check?: string;
  readonly address_postal_code_check?: string;
  readonly cvc_check?: string;
  constructor(init: ModelInit<CardChecks>);
}

export declare class StripeMetadata {
  readonly key: string;
  readonly value: string;
  constructor(init: ModelInit<StripeMetadata>);
}

export declare class StartStripePaymentOutput {
  readonly clientSecret: string;
  readonly status: string;
  constructor(init: ModelInit<StartStripePaymentOutput>);
}

export declare class ChainStyle {
  readonly colors?: ChainStyleColors;
  readonly images?: ChainStyleImages;
  constructor(init: ModelInit<ChainStyle>);
}

export declare class ChainStyleColors {
  readonly backgroundLight?: string;
  readonly backgroundDark?: string;
  readonly borderLight?: string;
  readonly borderDark?: string;
  readonly disabled?: string;
  readonly highlight?: string;
  readonly indicator?: string;
  readonly textLight?: string;
  readonly textDark?: string;
  constructor(init: ModelInit<ChainStyleColors>);
}

export declare class ChainStyleImages {
  readonly header?: string;
  readonly logo?: string;
  constructor(init: ModelInit<ChainStyleImages>);
}

export declare class StatusLog {
  readonly userId?: string;
  readonly status?: string;
  readonly ts?: number;
  constructor(init: ModelInit<StatusLog>);
}

export declare class PriceShown {
  readonly currency?: string;
  readonly pricePerUnit?: number;
  readonly priceSum?: number;
  readonly tax?: number;
  readonly taxSum?: number;
  constructor(init: ModelInit<PriceShown>);
}

export declare class OrderItem {
  readonly id: string;
  readonly created?: number;
  readonly productName?: LocalizedItem;
  readonly priceShown?: PriceShown;
  readonly productId?: string;
  readonly quantity?: number;
  readonly statusLog?: (StatusLog | null)[];
  readonly variantId?: string;
  readonly variantName?: LocalizedItem;
  readonly laneId?: string;
  constructor(init: ModelInit<OrderItem>);
}

export declare class Place {
  readonly seat?: string;
  readonly table?: string;
  constructor(init: ModelInit<Place>);
}

export declare class ProductVariant {
  readonly variantName?: LocalizedItem;
  readonly pack?: ProductVariantPack;
  readonly refGroupPrice?: number;
  readonly isAvailable?: boolean;
  readonly price?: number;
  readonly availabilities?: (Availability | null)[];
  readonly availableFrom?: string;
  readonly position?: string;
  constructor(init: ModelInit<ProductVariant>);
}

export declare class ProductVariantPack {
  readonly size?: number;
  readonly unit?: string;
  constructor(init: ModelInit<ProductVariantPack>);
}

export declare class Availability {
  readonly type?: string;
  readonly dayFrom?: string;
  readonly dayTo?: string;
  readonly timeFrom?: string;
  readonly timeTo?: string;
  readonly price?: number;
  constructor(init: ModelInit<Availability>);
}

export declare class PaymentMode {
  readonly name: string;
  readonly caption?: string;
  readonly method: string;
  constructor(init: ModelInit<PaymentMode>);
}

export declare class FloorMapData {
  readonly w?: number;
  readonly h?: number;
  readonly objects?: (FloorMapDataObject | null)[];
  constructor(init: ModelInit<FloorMapData>);
}

export declare class FloorMapDataObject {
  readonly id: string;
  readonly t: string;
  readonly c?: string;
  readonly w?: number;
  readonly h?: number;
  readonly r?: number;
  readonly a?: number;
  readonly x: number;
  readonly y: number;
  readonly tID?: string;
  readonly sID?: string;
  constructor(init: ModelInit<FloorMapDataObject>);
}

export declare class Lane {
  readonly id?: string;
  readonly name?: string;
  readonly color?: string;
  constructor(init: ModelInit<Lane>);
}

export declare class DailySchedule {
  readonly from?: string;
  readonly to?: string;
  constructor(init: ModelInit<DailySchedule>);
}

export declare class WeeklySchedule {
  readonly mon?: DailySchedule;
  readonly tue?: DailySchedule;
  readonly wed?: DailySchedule;
  readonly thu?: DailySchedule;
  readonly fri?: DailySchedule;
  readonly sat?: DailySchedule;
  readonly sun?: DailySchedule;
  readonly override?: (CustomDailySchedule | null)[];
  constructor(init: ModelInit<WeeklySchedule>);
}

export declare class CustomDailySchedule {
  readonly date?: string;
  readonly from?: string;
  readonly to?: string;
  constructor(init: ModelInit<CustomDailySchedule>);
}

export declare class AdminUser {
  readonly id: string;
  readonly name?: string;
  readonly profileImage?: string;
  readonly roles: AdminUserRole;
  readonly settings?: AdminUserSettings;
  readonly email?: string;
  readonly phone?: string;
  constructor(init: ModelInit<AdminUser>);
  static copyOf(source: AdminUser, mutator: (draft: MutableModel<AdminUser>) => MutableModel<AdminUser> | void): AdminUser;
}

export declare class StripeCard {
  readonly id: string;
  readonly brand?: CardBrand | keyof typeof CardBrand;
  readonly checks?: CardChecks;
  readonly country?: string;
  readonly last4?: string;
  readonly exp_month?: number;
  readonly exp_year?: number;
  readonly fingerprint?: string;
  readonly funding?: CardFundingType | keyof typeof CardFundingType;
  readonly three_d_secure?: string;
  readonly object: string;
  readonly metadata: StripeMetadata[];
  constructor(init: ModelInit<StripeCard>);
  static copyOf(source: StripeCard, mutator: (draft: MutableModel<StripeCard>) => MutableModel<StripeCard> | void): StripeCard;
}

export declare class Chain {
  readonly id: string;
  readonly name?: string;
  readonly description?: LocalizedItem;
  readonly style?: ChainStyle;
  readonly isActive?: boolean;
  constructor(init: ModelInit<Chain>);
  static copyOf(source: Chain, mutator: (draft: MutableModel<Chain>) => MutableModel<Chain> | void): Chain;
}

export declare class Group {
  readonly id: string;
  readonly chainId: string;
  readonly name?: string;
  readonly description?: LocalizedItem;
  readonly currency?: string;
  readonly address?: Address;
  readonly email?: string;
  readonly phone?: string;
  constructor(init: ModelInit<Group>);
  static copyOf(source: Group, mutator: (draft: MutableModel<Group>) => MutableModel<Group> | void): Group;
}

export declare class Order {
  readonly id: string;
  readonly created?: number;
  readonly items?: (OrderItem | null)[];
  readonly paymentMethod?: string;
  readonly staffId?: string;
  readonly statusLog?: (StatusLog | null)[];
  readonly sumPriceShown?: PriceShown;
  readonly takeAway?: boolean;
  readonly userId?: string;
  readonly place?: Place;
  readonly paymentIntention?: number;
  constructor(init: ModelInit<Order>);
  static copyOf(source: Order, mutator: (draft: MutableModel<Order>) => MutableModel<Order> | void): Order;
}

export declare class ProductCategory {
  readonly id: string;
  readonly description?: LocalizedItem;
  readonly image?: string;
  readonly name?: LocalizedItem;
  readonly position?: string;
  constructor(init: ModelInit<ProductCategory>);
  static copyOf(source: ProductCategory, mutator: (draft: MutableModel<ProductCategory>) => MutableModel<ProductCategory> | void): ProductCategory;
}

export declare class ChainProduct {
  readonly id: string;
  readonly description?: LocalizedItem;
  readonly extends?: string;
  readonly image?: string;
  readonly isVisible?: boolean;
  readonly tax?: number;
  readonly name?: LocalizedItem;
  readonly position?: string;
  readonly productCategoryId?: string;
  readonly laneId?: string;
  readonly productType?: string;
  readonly variants?: (ProductVariant | null)[];
  constructor(init: ModelInit<ChainProduct>);
  static copyOf(source: ChainProduct, mutator: (draft: MutableModel<ChainProduct>) => MutableModel<ChainProduct> | void): ChainProduct;
}

export declare class Unit {
  readonly id: string;
  readonly groupId: string;
  readonly isActive?: boolean;
  readonly isAcceptingOrders?: boolean;
  readonly name?: string;
  readonly description?: LocalizedItem;
  readonly paymentModes?: (PaymentMode | null)[];
  readonly floorMap?: FloorMapData;
  readonly lanes?: (Lane | null)[];
  readonly open?: DailySchedule;
  readonly openingHours?: WeeklySchedule;
  constructor(init: ModelInit<Unit>);
  static copyOf(source: Unit, mutator: (draft: MutableModel<Unit>) => MutableModel<Unit> | void): Unit;
}

export declare class User {
  readonly id: string;
  readonly name?: string;
  readonly email?: string;
  readonly phone?: string;
  readonly profileImage?: string;
  readonly login?: string;
  constructor(init: ModelInit<User>);
  static copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}