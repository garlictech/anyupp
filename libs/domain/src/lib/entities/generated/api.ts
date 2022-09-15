import { Observable } from 'rxjs';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: string;
}

export interface Address {
  address: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  location?: Maybe<LocationLatLng>;
  postalCode: Scalars['String'];
  title: Scalars['String'];
}

export interface AddressInput {
  address: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  postalCode: Scalars['String'];
  title: Scalars['String'];
}

export interface AdminUser {
  createdAt: Scalars['AWSDateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  phone: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  settings?: Maybe<AdminUserSettings>;
  updatedAt: Scalars['AWSDateTime'];
}

export interface AdminUserSettings {
  selectedHistoryDate?: Maybe<Scalars['Int']>;
  selectedLanguage?: Maybe<Scalars['String']>;
  selectedProductCategoryId?: Maybe<Scalars['String']>;
  selectedUnitId?: Maybe<Scalars['String']>;
}

export interface AdminUserSettingsInput {
  selectedHistoryDate?: InputMaybe<Scalars['Int']>;
  selectedLanguage?: InputMaybe<Scalars['String']>;
  selectedProductCategoryId?: InputMaybe<Scalars['String']>;
  selectedUnitId?: InputMaybe<Scalars['String']>;
}

export enum Allergen {
  celery = 'celery',
  crustaceans = 'crustaceans',
  egg = 'egg',
  fish = 'fish',
  gluten = 'gluten',
  lupin = 'lupin',
  milk = 'milk',
  molluscs = 'molluscs',
  mustard = 'mustard',
  peanut = 'peanut',
  sesame = 'sesame',
  soya = 'soya',
  sulphites = 'sulphites',
  treenuts = 'treenuts'
}

export interface Availability {
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  type: Scalars['String'];
}

export interface AvailabilityInput {
  dayFrom?: InputMaybe<Scalars['String']>;
  dayTo?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
  timeFrom?: InputMaybe<Scalars['String']>;
  timeTo?: InputMaybe<Scalars['String']>;
  type: Scalars['String'];
}

export interface BillingAddress {
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
}

export interface BillingAddressInput {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  line1?: InputMaybe<Scalars['String']>;
  line2?: InputMaybe<Scalars['String']>;
  postal_code?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
}

export interface BillingDetails {
  address?: Maybe<BillingAddress>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface BillingDetailsInput {
  address?: InputMaybe<BillingAddressInput>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
}

export interface CallWaiterInput {
  guestLabel: Scalars['String'];
  info?: InputMaybe<Scalars['String']>;
  place: PlaceInput;
  unitId: Scalars['ID'];
}

export enum CardBrand {
  amex = 'amex',
  diners = 'diners',
  discover = 'discover',
  jcb = 'jcb',
  mastercard = 'mastercard',
  unionpay = 'unionpay',
  unknown = 'unknown',
  visa = 'visa'
}

export interface CardChecks {
  address_line1_check?: Maybe<Scalars['String']>;
  address_postal_code_check?: Maybe<Scalars['String']>;
  cvc_check?: Maybe<Scalars['String']>;
}

export interface CardChecksInput {
  address_line1_check?: InputMaybe<Scalars['String']>;
  address_postal_code_check?: InputMaybe<Scalars['String']>;
  cvc_check?: InputMaybe<Scalars['String']>;
}

export enum CardFundingType {
  credit = 'credit',
  debit = 'debit',
  prepaid = 'prepaid',
  unknown = 'unknown'
}

export interface Cart {
  createdAt: Scalars['AWSDateTime'];
  guestLabel?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  items: Array<OrderItem>;
  orderMode?: Maybe<OrderMode>;
  orderPolicy?: Maybe<OrderPolicy>;
  paymentMode?: Maybe<PaymentMode>;
  place?: Maybe<Place>;
  servingMode?: Maybe<ServingMode>;
  /** @deprecated Use `servingMode`. */
  takeAway?: Maybe<Scalars['Boolean']>;
  unitId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
  version?: Maybe<Scalars['Int']>;
}

export interface ChainStyle {
  colors: ChainStyleColors;
  images?: Maybe<ChainStyleImages>;
}

export interface ChainStyleColors {
  /** @deprecated Unused. */
  backgroundDark?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  backgroundLight?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  borderDark?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  borderLight?: Maybe<Scalars['String']>;
  button?: Maybe<Scalars['String']>;
  buttonText?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  disabled?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  /** @deprecated Use `primary`. */
  indicator?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  primary?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  secondary?: Maybe<Scalars['String']>;
  /** @deprecated Use `secondary`. */
  textDark?: Maybe<Scalars['String']>;
  /** @deprecated Unused. */
  textLight?: Maybe<Scalars['String']>;
}

export interface ChainStyleColorsInput {
  backgroundDark?: InputMaybe<Scalars['String']>;
  backgroundLight?: InputMaybe<Scalars['String']>;
  borderDark?: InputMaybe<Scalars['String']>;
  borderLight?: InputMaybe<Scalars['String']>;
  button?: InputMaybe<Scalars['String']>;
  buttonText?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['String']>;
  highlight?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  indicator?: InputMaybe<Scalars['String']>;
  primary?: InputMaybe<Scalars['String']>;
  secondary?: InputMaybe<Scalars['String']>;
  textDark?: InputMaybe<Scalars['String']>;
  textLight?: InputMaybe<Scalars['String']>;
}

export interface ChainStyleImages {
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface ChainStyleImagesInput {
  header?: InputMaybe<Scalars['String']>;
  logo?: InputMaybe<Scalars['String']>;
}

export interface ChainStyleInput {
  colors: ChainStyleColorsInput;
  images?: InputMaybe<ChainStyleImagesInput>;
}

export interface CreateAdminUserInput {
  email: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  name: Scalars['String'];
  phone: Scalars['String'];
  profileImage?: InputMaybe<Scalars['String']>;
  settings?: InputMaybe<AdminUserSettingsInput>;
}

export interface CreateAnonymUserOutput {
  pwd: Scalars['String'];
  username: Scalars['String'];
}

export interface CreateCartInput {
  guestLabel?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  items: Array<OrderItemInput>;
  orderMode?: InputMaybe<OrderMode>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  paymentMode?: InputMaybe<PaymentModeInput>;
  place?: InputMaybe<PlaceInput>;
  servingMode?: InputMaybe<ServingMode>;
  takeAway?: InputMaybe<Scalars['Boolean']>;
  unitId: Scalars['ID'];
  userId: Scalars['ID'];
  version?: InputMaybe<Scalars['Int']>;
}

export interface CreateFavoriteProductInput {
  id?: InputMaybe<Scalars['ID']>;
  product: GeneratedProductInput;
  unitId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface CreateInvoiceInput {
  city: Scalars['String'];
  country: Scalars['String'];
  customerName: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  externalInvoiceId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  orderId: Scalars['ID'];
  pdfUrl?: InputMaybe<Scalars['String']>;
  postalCode: Scalars['String'];
  status: InvoiceStatus;
  streetAddress: Scalars['String'];
  taxNumber: Scalars['String'];
  transactionId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface CreateOrderFromCartInput {
  id: Scalars['ID'];
}

export interface CreateOrderInput {
  archived?: InputMaybe<Scalars['Boolean']>;
  externalId?: InputMaybe<Scalars['String']>;
  guestLabel?: InputMaybe<Scalars['String']>;
  hasRated?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  items: Array<OrderItemInput>;
  orderMode?: InputMaybe<OrderMode>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  packagingFeeTaxPercentage?: InputMaybe<Scalars['Float']>;
  packagingSum?: InputMaybe<PriceInput>;
  paymentIntention?: InputMaybe<Scalars['Float']>;
  paymentMode?: InputMaybe<PaymentModeInput>;
  place?: InputMaybe<PlaceInput>;
  rating?: InputMaybe<OrderRatingInput>;
  ratingPolicies?: InputMaybe<Array<RatingPolicyInput>>;
  serviceFee?: InputMaybe<CumulatedPriceInput>;
  serviceFeePolicy?: InputMaybe<ServiceFeePolicyInput>;
  servingMode?: InputMaybe<ServingMode>;
  soldOutVisibilityPolicy?: InputMaybe<SoldOutVisibilityPolicy>;
  sumPriceShown: PriceShownInput;
  takeAway?: InputMaybe<Scalars['Boolean']>;
  tip?: InputMaybe<TipInput>;
  tipPolicy?: InputMaybe<TipPolicyInput>;
  transactionStatus?: InputMaybe<PaymentStatus>;
  unitId: Scalars['ID'];
  unpayCategory?: InputMaybe<UnpayCategory>;
  userId: Scalars['ID'];
  version?: InputMaybe<Scalars['Int']>;
  visitId?: InputMaybe<Scalars['String']>;
}

export interface CreateProductCategoryInput {
  description?: InputMaybe<LocalizedItemInput>;
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['String']>;
  name: LocalizedItemInput;
  ownerEntity: Scalars['ID'];
  parentId?: InputMaybe<Scalars['ID']>;
  position: Scalars['Int'];
}

export interface CreateProductComponentInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  dirty?: InputMaybe<Scalars['Boolean']>;
  externalId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  name: LocalizedItemInput;
  ownerEntity: Scalars['ID'];
}

export interface CreateProductComponentSetInput {
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description: Scalars['String'];
  dirty?: InputMaybe<Scalars['Boolean']>;
  externalId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  items: Array<Scalars['ID']>;
  maxSelection?: InputMaybe<Scalars['Int']>;
  name: LocalizedItemInput;
  ownerEntity: Scalars['ID'];
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  type: ProductComponentSetType;
}

export interface CreateReceiptInput {
  email?: InputMaybe<Scalars['String']>;
  externalReceiptId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  orderId: Scalars['ID'];
  pdfData?: InputMaybe<Scalars['String']>;
  status: ReceiptStatus;
  transactionId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface CreateTransactionInput {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  currency?: InputMaybe<Scalars['String']>;
  externalTransactionId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  invoiceId?: InputMaybe<Scalars['ID']>;
  orderId: Scalars['ID'];
  paymentMethodId?: InputMaybe<Scalars['String']>;
  receiptId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<PaymentStatus>;
  total?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  userId: Scalars['ID'];
}

export interface CreateUnitInput {
  adBanners?: InputMaybe<Array<InputMaybe<ImageAssetInput>>>;
  adBannersEnabled?: InputMaybe<Scalars['Boolean']>;
  address: AddressInput;
  canCallWaiter?: InputMaybe<Scalars['Boolean']>;
  canRequestVatInvoice?: InputMaybe<Scalars['Boolean']>;
  categoryOrders?: InputMaybe<Array<InputMaybe<NestedSortItemInput>>>;
  coverBanners?: InputMaybe<Array<InputMaybe<ImageAssetInput>>>;
  coverBannersEnabled?: InputMaybe<Scalars['Boolean']>;
  currency: Scalars['String'];
  description?: InputMaybe<LocalizedItemInput>;
  email?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  floorMap?: InputMaybe<FloorMapDataInput>;
  id?: InputMaybe<Scalars['ID']>;
  isAcceptingOrders: Scalars['Boolean'];
  isActive: Scalars['Boolean'];
  isVisibleInApp?: InputMaybe<Scalars['Boolean']>;
  lanes?: InputMaybe<Array<InputMaybe<LaneInput>>>;
  lastOrderNum?: InputMaybe<Scalars['Int']>;
  location: LocationLatLonInput;
  merchantId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  open?: InputMaybe<DateIntervalInput>;
  openingHours?: InputMaybe<WeeklyScheduleInput>;
  orderPaymentPolicy?: InputMaybe<OrderPaymentPolicy>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  packagingTaxPercentage?: InputMaybe<Scalars['Float']>;
  paymentModes?: InputMaybe<Array<InputMaybe<PaymentModeInput>>>;
  phone?: InputMaybe<Scalars['String']>;
  pos?: InputMaybe<PosInput>;
  ratingPolicies?: InputMaybe<Array<RatingPolicyInput>>;
  serviceFeePolicy?: InputMaybe<ServiceFeePolicyInput>;
  soldOutVisibilityPolicy?: InputMaybe<SoldOutVisibilityPolicy>;
  style: ChainStyleInput;
  supportedOrderModes?: InputMaybe<Array<OrderMode>>;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  timeZone?: InputMaybe<Scalars['String']>;
  tipPolicy?: InputMaybe<TipPolicyInput>;
}

export interface CreateUnitProductInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  configSets?: InputMaybe<Array<InputMaybe<ProductConfigSetInput>>>;
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<LocalizedItemInput>;
  dirty?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['String']>;
  isVisible: Scalars['Boolean'];
  laneId?: InputMaybe<Scalars['ID']>;
  name: LocalizedItemInput;
  position: Scalars['Int'];
  productCategoryId: Scalars['ID'];
  productType: ProductType;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  takeaway?: InputMaybe<Scalars['Boolean']>;
  takeawayTax?: InputMaybe<Scalars['Int']>;
  tax: Scalars['Int'];
  unitId: Scalars['ID'];
  variants?: InputMaybe<Array<InputMaybe<ProductVariantInput>>>;
}

export interface CreateUserInput {
  email?: InputMaybe<Scalars['String']>;
  fcmTokens?: InputMaybe<Array<FcmTokenInput>>;
  id?: InputMaybe<Scalars['ID']>;
  invoiceAddress?: InputMaybe<UserInvoiceAddressInput>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
  stripeCustomerId?: InputMaybe<Scalars['String']>;
}

export interface CreateVariantInput {
  availabilities?: InputMaybe<Array<InputMaybe<AvailabilityInput>>>;
  externalId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  isAvailable: Scalars['Boolean'];
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  ownerProduct: Scalars['String'];
  pack?: InputMaybe<ProductVariantPackInput>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: InputMaybe<Scalars['Boolean']>;
  variantName: LocalizedItemInput;
}

export interface CumulatedPrice {
  currency?: Maybe<Scalars['String']>;
  grossPrice?: Maybe<Scalars['Float']>;
  taxContent?: Maybe<Scalars['Float']>;
}

export interface CumulatedPriceInput {
  currency?: InputMaybe<Scalars['String']>;
  grossPrice?: InputMaybe<Scalars['Float']>;
  taxContent?: InputMaybe<Scalars['Float']>;
}

export interface CustomDailySchedule {
  date: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
}

export interface CustomDailyScheduleInput {
  date: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
}

export interface DateInterval {
  from: Scalars['String'];
  to: Scalars['String'];
}

export interface DateIntervalInput {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
}

export interface DateIntervalOpen {
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface DateIntervalOpenInput {
  from?: InputMaybe<Scalars['String']>;
  to?: InputMaybe<Scalars['String']>;
}

export interface DeleteAdminUserInput {
  id: Scalars['ID'];
}

export interface DeleteCartInput {
  id: Scalars['ID'];
}

export interface DeleteFavoriteProductInput {
  id: Scalars['ID'];
}

export interface DeleteInvoiceInput {
  id: Scalars['ID'];
}

export interface DeleteOrderInput {
  id: Scalars['ID'];
}

export interface DeleteProductCategoryInput {
  id: Scalars['ID'];
}

export interface DeleteProductComponentInput {
  id: Scalars['ID'];
}

export interface DeleteProductComponentSetInput {
  id: Scalars['ID'];
}

export interface DeleteReceiptInput {
  id: Scalars['ID'];
}

export interface DeleteTransactionInput {
  id: Scalars['ID'];
}

export interface DeleteUnitInput {
  id: Scalars['ID'];
}

export interface DeleteUnitProductInput {
  id: Scalars['ID'];
}

export interface DeleteUserInput {
  id: Scalars['ID'];
}

export interface DeleteVariantInput {
  id: Scalars['ID'];
}

export interface FcmToken {
  lastSeen: Scalars['AWSDateTime'];
  token: Scalars['String'];
}

export interface FcmTokenInput {
  lastSeen: Scalars['AWSDateTime'];
  token: Scalars['String'];
}

export interface FavoriteProduct {
  createdAt: Scalars['AWSDateTime'];
  id: Scalars['ID'];
  product: GeneratedProduct;
  unitId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
}

export interface FloorMapData {
  h: Scalars['Int'];
  objects?: Maybe<Array<FloorMapDataObject>>;
  w: Scalars['Int'];
}

export interface FloorMapDataInput {
  h: Scalars['Int'];
  objects?: InputMaybe<Array<FloorMapDataObjectInput>>;
  w: Scalars['Int'];
}

export interface FloorMapDataObject {
  a?: Maybe<Scalars['Int']>;
  c?: Maybe<Scalars['String']>;
  h?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  r?: Maybe<Scalars['Int']>;
  sID?: Maybe<Scalars['String']>;
  t: UnitMapObjectType;
  tID?: Maybe<Scalars['String']>;
  w?: Maybe<Scalars['Int']>;
  x: Scalars['Int'];
  y: Scalars['Int'];
}

export interface FloorMapDataObjectInput {
  a?: InputMaybe<Scalars['Int']>;
  c?: InputMaybe<Scalars['String']>;
  h?: InputMaybe<Scalars['Int']>;
  id: Scalars['ID'];
  r?: InputMaybe<Scalars['Int']>;
  sID?: InputMaybe<Scalars['String']>;
  t: UnitMapObjectType;
  tID?: InputMaybe<Scalars['String']>;
  w?: InputMaybe<Scalars['Int']>;
  x: Scalars['Int'];
  y: Scalars['Int'];
}

export interface GeneratedProduct {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  configSets?: Maybe<Array<Maybe<GeneratedProductConfigSet>>>;
  description?: Maybe<LocalizedItem>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  name: LocalizedItem;
  position: Scalars['Int'];
  productCategoryId: Scalars['ID'];
  productType: ProductType;
  soldOut?: Maybe<Scalars['Boolean']>;
  supportedServingModes?: Maybe<Array<ServingMode>>;
  takeawayTax?: Maybe<Scalars['Int']>;
  tax: Scalars['Int'];
  unitId: Scalars['ID'];
  variants: Array<GeneratedProductVariant>;
}

export interface GeneratedProductCategory {
  id: Scalars['ID'];
  position?: Maybe<Scalars['Int']>;
  productCategory: ProductCategory;
  productCategoryId: Scalars['ID'];
  productNum: Scalars['Int'];
  unitId: Scalars['ID'];
}

export interface GeneratedProductConfigComponent {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  externalId?: Maybe<Scalars['String']>;
  name: LocalizedItem;
  netPackagingFee?: Maybe<Scalars['Float']>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  soldOut?: Maybe<Scalars['Boolean']>;
}

export interface GeneratedProductConfigComponentInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  externalId?: InputMaybe<Scalars['String']>;
  name: LocalizedItemInput;
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  soldOut?: InputMaybe<Scalars['Boolean']>;
}

export interface GeneratedProductConfigSet {
  items: Array<GeneratedProductConfigComponent>;
  maxSelection?: Maybe<Scalars['Int']>;
  name: LocalizedItem;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
  supportedServingModes?: Maybe<Array<ServingMode>>;
  type: ProductComponentSetType;
}

export interface GeneratedProductConfigSetInput {
  items: Array<GeneratedProductConfigComponentInput>;
  maxSelection?: InputMaybe<Scalars['Int']>;
  name: LocalizedItemInput;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  type: ProductComponentSetType;
}

export interface GeneratedProductInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  configSets?: InputMaybe<Array<InputMaybe<GeneratedProductConfigSetInput>>>;
  description?: InputMaybe<LocalizedItemInput>;
  id?: InputMaybe<Scalars['ID']>;
  image?: InputMaybe<Scalars['String']>;
  name: LocalizedItemInput;
  position: Scalars['Int'];
  productCategoryId: Scalars['ID'];
  productType: ProductType;
  soldOut?: InputMaybe<Scalars['Boolean']>;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  takeawayTax?: InputMaybe<Scalars['Int']>;
  tax: Scalars['Int'];
  unitId: Scalars['ID'];
  variants: Array<GeneratedProductVariantInput>;
}

export interface GeneratedProductVariant {
  id: Scalars['ID'];
  netPackagingFee?: Maybe<Scalars['Float']>;
  pack?: Maybe<ProductVariantPack>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: Maybe<Scalars['Boolean']>;
  variantName: LocalizedItem;
}

export interface GeneratedProductVariantInput {
  id?: InputMaybe<Scalars['ID']>;
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  pack?: InputMaybe<ProductVariantPackInput>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: InputMaybe<Scalars['Boolean']>;
  variantName: LocalizedItemInput;
}

export interface GeoSearchConnection {
  items?: Maybe<Array<Maybe<Scalars['String']>>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export enum GeoSearchableObjectType {
  unit = 'unit'
}

export interface GeoUnit {
  address: Address;
  chainId: Scalars['ID'];
  currency: Scalars['String'];
  distance: Scalars['Int'];
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  isAcceptingOrders: Scalars['Boolean'];
  name: Scalars['String'];
  /** @deprecated The new and better openingHoursNext7 field should be used instead of this static string */
  openingHours?: Maybe<Scalars['String']>;
  openingHoursNext7: Array<OpeningHoursByDate>;
  orderPolicy?: Maybe<OrderPolicy>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  ratingPolicies?: Maybe<Array<RatingPolicy>>;
  serviceFeePolicy?: Maybe<ServiceFeePolicy>;
  soldOutVisibilityPolicy?: Maybe<SoldOutVisibilityPolicy>;
  style: ChainStyle;
  supportedOrderModes?: Maybe<Array<OrderMode>>;
  supportedServingModes?: Maybe<Array<ServingMode>>;
  tipPolicy?: Maybe<TipPolicy>;
  unit?: Maybe<Unit>;
}

export interface GeoUnitList {
  items?: Maybe<Array<Maybe<GeoUnit>>>;
}

export interface GetUnitsNearLocationInput {
  location: LocationLatLngInput;
}

export interface ImageAsset {
  imageUrl: Scalars['String'];
}

export interface ImageAssetInput {
  imageUrl: Scalars['String'];
}

export interface Invoice {
  city: Scalars['String'];
  country: Scalars['String'];
  createdAt: Scalars['AWSDateTime'];
  customerName: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  externalInvoiceId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  orderId: Scalars['ID'];
  pdfUrl?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  status: InvoiceStatus;
  streetAddress: Scalars['String'];
  taxNumber: Scalars['String'];
  transactionId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
}

export enum InvoiceStatus {
  failed = 'failed',
  success = 'success',
  waiting = 'waiting'
}

export interface Lane {
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface LaneInput {
  color: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
}

export interface LocalizedItem {
  de?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface LocalizedItemInput {
  de?: InputMaybe<Scalars['String']>;
  en?: InputMaybe<Scalars['String']>;
  hu?: InputMaybe<Scalars['String']>;
}

export interface LocationLatLng {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}

export interface LocationLatLngInput {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}

export interface LocationLatLon {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
}

export interface LocationLatLonInput {
  lat: Scalars['Float'];
  lon: Scalars['Float'];
}

export interface ModelAdminUserConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelAdminUserConditionInput>>>;
  email?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAdminUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAdminUserConditionInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  profileImage?: InputMaybe<ModelStringInput>;
}

export interface ModelAdminUserConnection {
  items: Array<Maybe<AdminUser>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelAdminUserFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelAdminUserFilterInput>>>;
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelAdminUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelAdminUserFilterInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  profileImage?: InputMaybe<ModelStringInput>;
}

export interface ModelAllergenListInput {
  contains?: InputMaybe<Allergen>;
  eq?: InputMaybe<Array<InputMaybe<Allergen>>>;
  ne?: InputMaybe<Array<InputMaybe<Allergen>>>;
  notContains?: InputMaybe<Allergen>;
}

export enum ModelAttributeTypes {
  _null = '_null',
  binary = 'binary',
  binaryset = 'binarySet',
  bool = 'bool',
  list = 'list',
  map = 'map',
  number = 'number',
  numberset = 'numberSet',
  string = 'string',
  stringset = 'stringSet'
}

export interface ModelBooleanInput {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
}

export interface ModelCartConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelCartConditionInput>>>;
  guestLabel?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelCartConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCartConditionInput>>>;
  orderMode?: InputMaybe<ModelOrderModeInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  servingMode?: InputMaybe<ModelServingModeInput>;
  takeAway?: InputMaybe<ModelBooleanInput>;
  unitId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
  version?: InputMaybe<ModelIntInput>;
}

export interface ModelCartConnection {
  items: Array<Maybe<Cart>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelCartFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelCartFilterInput>>>;
  guestLabel?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelCartFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelCartFilterInput>>>;
  orderMode?: InputMaybe<ModelOrderModeInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  servingMode?: InputMaybe<ModelServingModeInput>;
  takeAway?: InputMaybe<ModelBooleanInput>;
  unitId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
  version?: InputMaybe<ModelIntInput>;
}

export interface ModelFavoriteProductConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelFavoriteProductConditionInput>>>;
  not?: InputMaybe<ModelFavoriteProductConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFavoriteProductConditionInput>>>;
  unitId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelFavoriteProductConnection {
  items: Array<Maybe<FavoriteProduct>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelFavoriteProductFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelFavoriteProductFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelFavoriteProductFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelFavoriteProductFilterInput>>>;
  unitId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelFloatInput {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
}

export interface ModelIdInput {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  size?: InputMaybe<ModelSizeInput>;
}

export interface ModelIdKeyConditionInput {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
}

export interface ModelIntInput {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
}

export interface ModelInvoiceConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelInvoiceConditionInput>>>;
  city?: InputMaybe<ModelStringInput>;
  country?: InputMaybe<ModelStringInput>;
  customerName?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  externalInvoiceId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelInvoiceConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelInvoiceConditionInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  pdfUrl?: InputMaybe<ModelStringInput>;
  postalCode?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelInvoiceStatusInput>;
  streetAddress?: InputMaybe<ModelStringInput>;
  taxNumber?: InputMaybe<ModelStringInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelInvoiceConnection {
  items: Array<Maybe<Invoice>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelInvoiceFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelInvoiceFilterInput>>>;
  city?: InputMaybe<ModelStringInput>;
  country?: InputMaybe<ModelStringInput>;
  customerName?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  externalInvoiceId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelInvoiceFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelInvoiceFilterInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  pdfUrl?: InputMaybe<ModelStringInput>;
  postalCode?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelInvoiceStatusInput>;
  streetAddress?: InputMaybe<ModelStringInput>;
  taxNumber?: InputMaybe<ModelStringInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelInvoiceStatusInput {
  eq?: InputMaybe<InvoiceStatus>;
  ne?: InputMaybe<InvoiceStatus>;
}

export interface ModelOrderConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelOrderConditionInput>>>;
  archived?: InputMaybe<ModelBooleanInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  currentStatus?: InputMaybe<ModelOrderStatusInput>;
  externalId?: InputMaybe<ModelStringInput>;
  guestLabel?: InputMaybe<ModelStringInput>;
  hasRated?: InputMaybe<ModelBooleanInput>;
  not?: InputMaybe<ModelOrderConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelOrderConditionInput>>>;
  orderMode?: InputMaybe<ModelOrderModeInput>;
  orderNum?: InputMaybe<ModelStringInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  packagingFeeTaxPercentage?: InputMaybe<ModelFloatInput>;
  paymentIntention?: InputMaybe<ModelFloatInput>;
  servingMode?: InputMaybe<ModelServingModeInput>;
  soldOutVisibilityPolicy?: InputMaybe<ModelSoldOutVisibilityPolicyInput>;
  tipTransactionId?: InputMaybe<ModelIdInput>;
  tipTransactionStatus?: InputMaybe<ModelPaymentStatusInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  transactionStatus?: InputMaybe<ModelPaymentStatusInput>;
  unitId?: InputMaybe<ModelIdInput>;
  unpayCategory?: InputMaybe<ModelUnpayCategoryInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
  version?: InputMaybe<ModelIntInput>;
  visitId?: InputMaybe<ModelStringInput>;
}

export interface ModelOrderConnection {
  items: Array<Maybe<Order>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelOrderFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelOrderFilterInput>>>;
  archived?: InputMaybe<ModelBooleanInput>;
  createdAt?: InputMaybe<ModelStringInput>;
  currentStatus?: InputMaybe<ModelOrderStatusInput>;
  externalId?: InputMaybe<ModelStringInput>;
  guestLabel?: InputMaybe<ModelStringInput>;
  hasRated?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelOrderFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelOrderFilterInput>>>;
  orderMode?: InputMaybe<ModelOrderModeInput>;
  orderNum?: InputMaybe<ModelStringInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  packagingFeeTaxPercentage?: InputMaybe<ModelFloatInput>;
  paymentIntention?: InputMaybe<ModelFloatInput>;
  servingMode?: InputMaybe<ModelServingModeInput>;
  soldOutVisibilityPolicy?: InputMaybe<ModelSoldOutVisibilityPolicyInput>;
  tipTransactionId?: InputMaybe<ModelIdInput>;
  tipTransactionStatus?: InputMaybe<ModelPaymentStatusInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  transactionStatus?: InputMaybe<ModelPaymentStatusInput>;
  unitId?: InputMaybe<ModelIdInput>;
  unpayCategory?: InputMaybe<ModelUnpayCategoryInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
  version?: InputMaybe<ModelIntInput>;
  visitId?: InputMaybe<ModelStringInput>;
}

export interface ModelOrderModeInput {
  eq?: InputMaybe<OrderMode>;
  ne?: InputMaybe<OrderMode>;
}

export interface ModelOrderModeListInput {
  contains?: InputMaybe<OrderMode>;
  eq?: InputMaybe<Array<InputMaybe<OrderMode>>>;
  ne?: InputMaybe<Array<InputMaybe<OrderMode>>>;
  notContains?: InputMaybe<OrderMode>;
}

export interface ModelOrderPaymentPolicyInput {
  eq?: InputMaybe<OrderPaymentPolicy>;
  ne?: InputMaybe<OrderPaymentPolicy>;
}

export interface ModelOrderPolicyInput {
  eq?: InputMaybe<OrderPolicy>;
  ne?: InputMaybe<OrderPolicy>;
}

export interface ModelOrderStatusInput {
  eq?: InputMaybe<OrderStatus>;
  ne?: InputMaybe<OrderStatus>;
}

export interface ModelPaymentStatusInput {
  eq?: InputMaybe<PaymentStatus>;
  ne?: InputMaybe<PaymentStatus>;
}

export interface ModelProductCategoryConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelProductCategoryConditionInput>>>;
  image?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProductCategoryConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductCategoryConditionInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
  parentId?: InputMaybe<ModelIdInput>;
  position?: InputMaybe<ModelIntInput>;
}

export interface ModelProductCategoryConnection {
  items: Array<Maybe<ProductCategory>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelProductCategoryFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelProductCategoryFilterInput>>>;
  id?: InputMaybe<ModelIdInput>;
  image?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProductCategoryFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductCategoryFilterInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
  parentId?: InputMaybe<ModelIdInput>;
  position?: InputMaybe<ModelIntInput>;
}

export interface ModelProductComponentConditionInput {
  allergens?: InputMaybe<ModelAllergenListInput>;
  and?: InputMaybe<Array<InputMaybe<ModelProductComponentConditionInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  externalId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelProductComponentConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductComponentConditionInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
}

export interface ModelProductComponentConnection {
  items: Array<Maybe<ProductComponent>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelProductComponentFilterInput {
  allergens?: InputMaybe<ModelAllergenListInput>;
  and?: InputMaybe<Array<InputMaybe<ModelProductComponentFilterInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  externalId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelProductComponentFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductComponentFilterInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
}

export interface ModelProductComponentSetConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelProductComponentSetConditionInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  externalId?: InputMaybe<ModelStringInput>;
  items?: InputMaybe<ModelIdInput>;
  maxSelection?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelProductComponentSetConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductComponentSetConditionInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  type?: InputMaybe<ModelProductComponentSetTypeInput>;
}

export interface ModelProductComponentSetConnection {
  items: Array<Maybe<ProductComponentSet>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelProductComponentSetFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelProductComponentSetFilterInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  description?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  externalId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  items?: InputMaybe<ModelIdInput>;
  maxSelection?: InputMaybe<ModelIntInput>;
  not?: InputMaybe<ModelProductComponentSetFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelProductComponentSetFilterInput>>>;
  ownerEntity?: InputMaybe<ModelIdInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  type?: InputMaybe<ModelProductComponentSetTypeInput>;
}

export interface ModelProductComponentSetTypeInput {
  eq?: InputMaybe<ProductComponentSetType>;
  ne?: InputMaybe<ProductComponentSetType>;
}

export interface ModelProductTypeInput {
  eq?: InputMaybe<ProductType>;
  ne?: InputMaybe<ProductType>;
}

export interface ModelReceiptConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelReceiptConditionInput>>>;
  email?: InputMaybe<ModelStringInput>;
  externalReceiptId?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelReceiptConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelReceiptConditionInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  pdfData?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelReceiptStatusInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelReceiptConnection {
  items: Array<Maybe<Receipt>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelReceiptFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelReceiptFilterInput>>>;
  email?: InputMaybe<ModelStringInput>;
  externalReceiptId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelReceiptFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelReceiptFilterInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  pdfData?: InputMaybe<ModelStringInput>;
  status?: InputMaybe<ModelReceiptStatusInput>;
  transactionId?: InputMaybe<ModelIdInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelReceiptStatusInput {
  eq?: InputMaybe<ReceiptStatus>;
  ne?: InputMaybe<ReceiptStatus>;
}

export interface ModelServingModeInput {
  eq?: InputMaybe<ServingMode>;
  ne?: InputMaybe<ServingMode>;
}

export interface ModelServingModeListInput {
  contains?: InputMaybe<ServingMode>;
  eq?: InputMaybe<Array<InputMaybe<ServingMode>>>;
  ne?: InputMaybe<Array<InputMaybe<ServingMode>>>;
  notContains?: InputMaybe<ServingMode>;
}

export interface ModelSizeInput {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
}

export interface ModelSoldOutVisibilityPolicyInput {
  eq?: InputMaybe<SoldOutVisibilityPolicy>;
  ne?: InputMaybe<SoldOutVisibilityPolicy>;
}

export enum ModelSortDirection {
  asc = 'ASC',
  desc = 'DESC'
}

export interface ModelStringInput {
  attributeExists?: InputMaybe<Scalars['Boolean']>;
  attributeType?: InputMaybe<ModelAttributeTypes>;
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<ModelSizeInput>;
}

export interface ModelSubscriptionBooleanInput {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
}

export interface ModelSubscriptionFloatInput {
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  eq?: InputMaybe<Scalars['Float']>;
  ge?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
  le?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
}

export interface ModelSubscriptionIdInput {
  beginsWith?: InputMaybe<Scalars['ID']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  contains?: InputMaybe<Scalars['ID']>;
  eq?: InputMaybe<Scalars['ID']>;
  ge?: InputMaybe<Scalars['ID']>;
  gt?: InputMaybe<Scalars['ID']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  le?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  notContains?: InputMaybe<Scalars['ID']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
}

export interface ModelSubscriptionIntInput {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  eq?: InputMaybe<Scalars['Int']>;
  ge?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
  le?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
}

export interface ModelSubscriptionStringInput {
  beginsWith?: InputMaybe<Scalars['String']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  contains?: InputMaybe<Scalars['String']>;
  eq?: InputMaybe<Scalars['String']>;
  ge?: InputMaybe<Scalars['String']>;
  gt?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  le?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  notContains?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
}

export interface ModelTransactionConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelTransactionConditionInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  currency?: InputMaybe<ModelStringInput>;
  externalTransactionId?: InputMaybe<ModelStringInput>;
  invoiceId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelTransactionConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTransactionConditionInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  paymentMethodId?: InputMaybe<ModelStringInput>;
  receiptId?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelPaymentStatusInput>;
  total?: InputMaybe<ModelFloatInput>;
  type?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelTransactionConnection {
  items: Array<Maybe<Transaction>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelTransactionFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelTransactionFilterInput>>>;
  createdAt?: InputMaybe<ModelStringInput>;
  currency?: InputMaybe<ModelStringInput>;
  externalTransactionId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  invoiceId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelTransactionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelTransactionFilterInput>>>;
  orderId?: InputMaybe<ModelIdInput>;
  paymentMethodId?: InputMaybe<ModelStringInput>;
  receiptId?: InputMaybe<ModelIdInput>;
  status?: InputMaybe<ModelPaymentStatusInput>;
  total?: InputMaybe<ModelFloatInput>;
  type?: InputMaybe<ModelStringInput>;
  updatedAt?: InputMaybe<ModelStringInput>;
  userId?: InputMaybe<ModelIdInput>;
}

export interface ModelUnitConditionInput {
  adBannersEnabled?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUnitConditionInput>>>;
  canCallWaiter?: InputMaybe<ModelBooleanInput>;
  canRequestVatInvoice?: InputMaybe<ModelBooleanInput>;
  currency?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  externalId?: InputMaybe<ModelStringInput>;
  isAcceptingOrders?: InputMaybe<ModelBooleanInput>;
  isActive?: InputMaybe<ModelBooleanInput>;
  isVisibleInApp?: InputMaybe<ModelBooleanInput>;
  lastOrderNum?: InputMaybe<ModelIntInput>;
  merchantId?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUnitConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUnitConditionInput>>>;
  orderPaymentPolicy?: InputMaybe<ModelOrderPaymentPolicyInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  packagingTaxPercentage?: InputMaybe<ModelFloatInput>;
  phone?: InputMaybe<ModelStringInput>;
  soldOutVisibilityPolicy?: InputMaybe<ModelSoldOutVisibilityPolicyInput>;
  supportedOrderModes?: InputMaybe<ModelOrderModeListInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  timeZone?: InputMaybe<ModelStringInput>;
}

export interface ModelUnitConnection {
  items: Array<Maybe<Unit>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelUnitFilterInput {
  adBannersEnabled?: InputMaybe<ModelBooleanInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUnitFilterInput>>>;
  canCallWaiter?: InputMaybe<ModelBooleanInput>;
  canRequestVatInvoice?: InputMaybe<ModelBooleanInput>;
  currency?: InputMaybe<ModelStringInput>;
  email?: InputMaybe<ModelStringInput>;
  externalId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isAcceptingOrders?: InputMaybe<ModelBooleanInput>;
  isActive?: InputMaybe<ModelBooleanInput>;
  isVisibleInApp?: InputMaybe<ModelBooleanInput>;
  lastOrderNum?: InputMaybe<ModelIntInput>;
  merchantId?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUnitFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUnitFilterInput>>>;
  orderPaymentPolicy?: InputMaybe<ModelOrderPaymentPolicyInput>;
  orderPolicy?: InputMaybe<ModelOrderPolicyInput>;
  packagingTaxPercentage?: InputMaybe<ModelFloatInput>;
  phone?: InputMaybe<ModelStringInput>;
  soldOutVisibilityPolicy?: InputMaybe<ModelSoldOutVisibilityPolicyInput>;
  supportedOrderModes?: InputMaybe<ModelOrderModeListInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  timeZone?: InputMaybe<ModelStringInput>;
}

export interface ModelUnitProductConditionInput {
  allergens?: InputMaybe<ModelAllergenListInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUnitProductConditionInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  image?: InputMaybe<ModelStringInput>;
  isVisible?: InputMaybe<ModelBooleanInput>;
  laneId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUnitProductConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUnitProductConditionInput>>>;
  position?: InputMaybe<ModelIntInput>;
  productCategoryId?: InputMaybe<ModelIdInput>;
  productType?: InputMaybe<ModelProductTypeInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  takeaway?: InputMaybe<ModelBooleanInput>;
  takeawayTax?: InputMaybe<ModelIntInput>;
  tax?: InputMaybe<ModelIntInput>;
  unitId?: InputMaybe<ModelIdInput>;
}

export interface ModelUnitProductConnection {
  items: Array<Maybe<UnitProduct>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelUnitProductFilterInput {
  allergens?: InputMaybe<ModelAllergenListInput>;
  and?: InputMaybe<Array<InputMaybe<ModelUnitProductFilterInput>>>;
  deletedAt?: InputMaybe<ModelStringInput>;
  dirty?: InputMaybe<ModelBooleanInput>;
  id?: InputMaybe<ModelIdInput>;
  image?: InputMaybe<ModelStringInput>;
  isVisible?: InputMaybe<ModelBooleanInput>;
  laneId?: InputMaybe<ModelIdInput>;
  not?: InputMaybe<ModelUnitProductFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUnitProductFilterInput>>>;
  position?: InputMaybe<ModelIntInput>;
  productCategoryId?: InputMaybe<ModelIdInput>;
  productType?: InputMaybe<ModelProductTypeInput>;
  supportedServingModes?: InputMaybe<ModelServingModeListInput>;
  takeaway?: InputMaybe<ModelBooleanInput>;
  takeawayTax?: InputMaybe<ModelIntInput>;
  tax?: InputMaybe<ModelIntInput>;
  unitId?: InputMaybe<ModelIdInput>;
}

export interface ModelUnpayCategoryInput {
  eq?: InputMaybe<UnpayCategory>;
  ne?: InputMaybe<UnpayCategory>;
}

export interface ModelUserConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  email?: InputMaybe<ModelStringInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserConditionInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  profileImage?: InputMaybe<ModelStringInput>;
  stripeCustomerId?: InputMaybe<ModelStringInput>;
}

export interface ModelUserConnection {
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelUserFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  email?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  name?: InputMaybe<ModelStringInput>;
  not?: InputMaybe<ModelUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelUserFilterInput>>>;
  phone?: InputMaybe<ModelStringInput>;
  profileImage?: InputMaybe<ModelStringInput>;
  stripeCustomerId?: InputMaybe<ModelStringInput>;
}

export interface ModelVariantConditionInput {
  and?: InputMaybe<Array<InputMaybe<ModelVariantConditionInput>>>;
  externalId?: InputMaybe<ModelStringInput>;
  isAvailable?: InputMaybe<ModelBooleanInput>;
  netPackagingFee?: InputMaybe<ModelFloatInput>;
  not?: InputMaybe<ModelVariantConditionInput>;
  or?: InputMaybe<Array<InputMaybe<ModelVariantConditionInput>>>;
  ownerProduct?: InputMaybe<ModelStringInput>;
  position?: InputMaybe<ModelIntInput>;
  price?: InputMaybe<ModelFloatInput>;
  soldOut?: InputMaybe<ModelBooleanInput>;
}

export interface ModelVariantConnection {
  items: Array<Maybe<Variant>>;
  nextToken?: Maybe<Scalars['String']>;
}

export interface ModelVariantFilterInput {
  and?: InputMaybe<Array<InputMaybe<ModelVariantFilterInput>>>;
  externalId?: InputMaybe<ModelStringInput>;
  id?: InputMaybe<ModelIdInput>;
  isAvailable?: InputMaybe<ModelBooleanInput>;
  netPackagingFee?: InputMaybe<ModelFloatInput>;
  not?: InputMaybe<ModelVariantFilterInput>;
  or?: InputMaybe<Array<InputMaybe<ModelVariantFilterInput>>>;
  ownerProduct?: InputMaybe<ModelStringInput>;
  position?: InputMaybe<ModelIntInput>;
  price?: InputMaybe<ModelFloatInput>;
  soldOut?: InputMaybe<ModelBooleanInput>;
}

export interface Mutation {
  callWaiter?: Maybe<Scalars['Boolean']>;
  createAdminUser?: Maybe<AdminUser>;
  createAnonymUser?: Maybe<CreateAnonymUserOutput>;
  createCart?: Maybe<Cart>;
  createFavoriteProduct?: Maybe<FavoriteProduct>;
  createInvoice?: Maybe<Invoice>;
  createOrder?: Maybe<Order>;
  createOrderFromCart?: Maybe<Scalars['ID']>;
  createProductCategory?: Maybe<ProductCategory>;
  createProductComponent?: Maybe<ProductComponent>;
  createProductComponentSet?: Maybe<ProductComponentSet>;
  createReceipt?: Maybe<Receipt>;
  createStripeCard?: Maybe<StripeCard>;
  createTransaction?: Maybe<Transaction>;
  createUnit?: Maybe<Unit>;
  createUnitProduct?: Maybe<UnitProduct>;
  createUser?: Maybe<User>;
  createVariant?: Maybe<Variant>;
  deleteAdminUser?: Maybe<AdminUser>;
  deleteCart?: Maybe<Cart>;
  deleteFavoriteProduct?: Maybe<FavoriteProduct>;
  deleteInvoice?: Maybe<Invoice>;
  deleteMyStripeCard?: Maybe<Scalars['Boolean']>;
  deleteOrder?: Maybe<Order>;
  deleteProductCategory?: Maybe<ProductCategory>;
  deleteProductComponent?: Maybe<ProductComponent>;
  deleteProductComponentSet?: Maybe<ProductComponentSet>;
  deleteReceipt?: Maybe<Receipt>;
  deleteTransaction?: Maybe<Transaction>;
  deleteUnit?: Maybe<Unit>;
  deleteUnitProduct?: Maybe<UnitProduct>;
  deleteUser?: Maybe<User>;
  deleteVariant?: Maybe<Variant>;
  payTipWithStripe?: Maybe<StartStripePaymentOutput>;
  startStripePayment?: Maybe<StartStripePaymentOutput>;
  startStripePaymentConnected?: Maybe<StartStripePaymentOutput>;
  updateAdminUser?: Maybe<AdminUser>;
  updateCart?: Maybe<Cart>;
  updateFavoriteProduct?: Maybe<FavoriteProduct>;
  updateInvoice?: Maybe<Invoice>;
  updateMyStripeCard?: Maybe<StripeCard>;
  updateOrder?: Maybe<Order>;
  updateProductCategory?: Maybe<ProductCategory>;
  updateProductComponent?: Maybe<ProductComponent>;
  updateProductComponentSet?: Maybe<ProductComponentSet>;
  updateReceipt?: Maybe<Receipt>;
  updateTransaction?: Maybe<Transaction>;
  updateUnit?: Maybe<Unit>;
  updateUnitProduct?: Maybe<UnitProduct>;
  updateUnitRKeeperData?: Maybe<Unit>;
  updateUser?: Maybe<User>;
  updateVariant?: Maybe<Variant>;
}


export interface MutationCallWaiterArgs {
  input?: InputMaybe<CallWaiterInput>;
}


export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}


export interface MutationCreateCartArgs {
  condition?: InputMaybe<ModelCartConditionInput>;
  input: CreateCartInput;
}


export interface MutationCreateFavoriteProductArgs {
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
  input: CreateFavoriteProductInput;
}


export interface MutationCreateInvoiceArgs {
  condition?: InputMaybe<ModelInvoiceConditionInput>;
  input: CreateInvoiceInput;
}


export interface MutationCreateOrderArgs {
  input: CreateOrderInput;
}


export interface MutationCreateOrderFromCartArgs {
  input: CreateOrderFromCartInput;
}


export interface MutationCreateProductCategoryArgs {
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
  input: CreateProductCategoryInput;
}


export interface MutationCreateProductComponentArgs {
  condition?: InputMaybe<ModelProductComponentConditionInput>;
  input: CreateProductComponentInput;
}


export interface MutationCreateProductComponentSetArgs {
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
  input: CreateProductComponentSetInput;
}


export interface MutationCreateReceiptArgs {
  condition?: InputMaybe<ModelReceiptConditionInput>;
  input: CreateReceiptInput;
}


export interface MutationCreateStripeCardArgs {
  input: StripeCardCreateInput;
}


export interface MutationCreateTransactionArgs {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: CreateTransactionInput;
}


export interface MutationCreateUnitArgs {
  input: CreateUnitInput;
}


export interface MutationCreateUnitProductArgs {
  condition?: InputMaybe<ModelUnitProductConditionInput>;
  input: CreateUnitProductInput;
}


export interface MutationCreateUserArgs {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: CreateUserInput;
}


export interface MutationCreateVariantArgs {
  condition?: InputMaybe<ModelVariantConditionInput>;
  input: CreateVariantInput;
}


export interface MutationDeleteAdminUserArgs {
  input: DeleteAdminUserInput;
}


export interface MutationDeleteCartArgs {
  condition?: InputMaybe<ModelCartConditionInput>;
  input: DeleteCartInput;
}


export interface MutationDeleteFavoriteProductArgs {
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
  input: DeleteFavoriteProductInput;
}


export interface MutationDeleteInvoiceArgs {
  condition?: InputMaybe<ModelInvoiceConditionInput>;
  input: DeleteInvoiceInput;
}


export interface MutationDeleteMyStripeCardArgs {
  input: StripeCardDeleteInput;
}


export interface MutationDeleteOrderArgs {
  condition?: InputMaybe<ModelOrderConditionInput>;
  input: DeleteOrderInput;
}


export interface MutationDeleteProductCategoryArgs {
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
  input: DeleteProductCategoryInput;
}


export interface MutationDeleteProductComponentArgs {
  condition?: InputMaybe<ModelProductComponentConditionInput>;
  input: DeleteProductComponentInput;
}


export interface MutationDeleteProductComponentSetArgs {
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
  input: DeleteProductComponentSetInput;
}


export interface MutationDeleteReceiptArgs {
  condition?: InputMaybe<ModelReceiptConditionInput>;
  input: DeleteReceiptInput;
}


export interface MutationDeleteTransactionArgs {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: DeleteTransactionInput;
}


export interface MutationDeleteUnitArgs {
  condition?: InputMaybe<ModelUnitConditionInput>;
  input: DeleteUnitInput;
}


export interface MutationDeleteUnitProductArgs {
  condition?: InputMaybe<ModelUnitProductConditionInput>;
  input: DeleteUnitProductInput;
}


export interface MutationDeleteUserArgs {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: DeleteUserInput;
}


export interface MutationDeleteVariantArgs {
  condition?: InputMaybe<ModelVariantConditionInput>;
  input: DeleteVariantInput;
}


export interface MutationPayTipWithStripeArgs {
  input: PayTipWithStripeInput;
}


export interface MutationStartStripePaymentArgs {
  input: StartStripePaymentInput;
}


export interface MutationStartStripePaymentConnectedArgs {
  input: StartStripePaymentInput;
}


export interface MutationUpdateAdminUserArgs {
  condition?: InputMaybe<ModelAdminUserConditionInput>;
  input: UpdateAdminUserInput;
}


export interface MutationUpdateCartArgs {
  condition?: InputMaybe<ModelCartConditionInput>;
  input: UpdateCartInput;
}


export interface MutationUpdateFavoriteProductArgs {
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
  input: UpdateFavoriteProductInput;
}


export interface MutationUpdateInvoiceArgs {
  condition?: InputMaybe<ModelInvoiceConditionInput>;
  input: UpdateInvoiceInput;
}


export interface MutationUpdateMyStripeCardArgs {
  input: StripeCardUpdateInput;
}


export interface MutationUpdateOrderArgs {
  condition?: InputMaybe<ModelOrderConditionInput>;
  input: UpdateOrderInput;
}


export interface MutationUpdateProductCategoryArgs {
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
  input: UpdateProductCategoryInput;
}


export interface MutationUpdateProductComponentArgs {
  condition?: InputMaybe<ModelProductComponentConditionInput>;
  input: UpdateProductComponentInput;
}


export interface MutationUpdateProductComponentSetArgs {
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
  input: UpdateProductComponentSetInput;
}


export interface MutationUpdateReceiptArgs {
  condition?: InputMaybe<ModelReceiptConditionInput>;
  input: UpdateReceiptInput;
}


export interface MutationUpdateTransactionArgs {
  condition?: InputMaybe<ModelTransactionConditionInput>;
  input: UpdateTransactionInput;
}


export interface MutationUpdateUnitArgs {
  input: UpdateUnitInput;
}


export interface MutationUpdateUnitProductArgs {
  condition?: InputMaybe<ModelUnitProductConditionInput>;
  input: UpdateUnitProductInput;
}


export interface MutationUpdateUnitRKeeperDataArgs {
  input: UpdateRKeeperDataInput;
}


export interface MutationUpdateUserArgs {
  condition?: InputMaybe<ModelUserConditionInput>;
  input: UpdateUserInput;
}


export interface MutationUpdateVariantArgs {
  condition?: InputMaybe<ModelVariantConditionInput>;
  input: UpdateVariantInput;
}

export interface NestedSortItem {
  id: Scalars['ID'];
  parentId?: Maybe<Scalars['ID']>;
}

export interface NestedSortItemInput {
  id?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
}

export interface OpeningHoursByDate {
  closed: Scalars['Boolean'];
  date: Scalars['String'];
  from?: Maybe<Scalars['Float']>;
  to?: Maybe<Scalars['Float']>;
}

export interface Order {
  archived: Scalars['Boolean'];
  createdAt: Scalars['AWSDateTime'];
  currentStatus?: Maybe<OrderStatus>;
  externalId?: Maybe<Scalars['String']>;
  guestLabel?: Maybe<Scalars['String']>;
  hasRated?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  items: Array<OrderItem>;
  orderMode?: Maybe<OrderMode>;
  orderNum?: Maybe<Scalars['String']>;
  orderPolicy?: Maybe<OrderPolicy>;
  packagingFeeTaxPercentage?: Maybe<Scalars['Float']>;
  packagingSum?: Maybe<Price>;
  paymentIntention?: Maybe<Scalars['Float']>;
  paymentMode?: Maybe<PaymentMode>;
  place?: Maybe<Place>;
  rating?: Maybe<OrderRating>;
  ratingPolicies?: Maybe<Array<RatingPolicy>>;
  serviceFee?: Maybe<CumulatedPrice>;
  serviceFeePolicy?: Maybe<ServiceFeePolicy>;
  servingMode?: Maybe<ServingMode>;
  soldOutVisibilityPolicy?: Maybe<SoldOutVisibilityPolicy>;
  statusLog: Array<StatusLog>;
  sumPriceShown: PriceShown;
  tip?: Maybe<Tip>;
  tipPolicy?: Maybe<TipPolicy>;
  tipTransaction?: Maybe<Transaction>;
  tipTransactionId?: Maybe<Scalars['ID']>;
  tipTransactionStatus?: Maybe<PaymentStatus>;
  transaction?: Maybe<Transaction>;
  transactionId?: Maybe<Scalars['ID']>;
  transactionStatus?: Maybe<PaymentStatus>;
  unitId: Scalars['ID'];
  unpayCategory?: Maybe<UnpayCategory>;
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
  version?: Maybe<Scalars['Int']>;
  visitId?: Maybe<Scalars['String']>;
}

export interface OrderItem {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  configSets?: Maybe<Array<OrderItemConfigSet>>;
  created?: Maybe<Scalars['Float']>;
  externalId?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  laneId?: Maybe<Scalars['ID']>;
  netPackagingFee?: Maybe<Scalars['Float']>;
  priceShown: PriceShown;
  productId: Scalars['ID'];
  productName: LocalizedItem;
  productType?: Maybe<ProductType>;
  quantity: Scalars['Int'];
  serviceFee?: Maybe<Price>;
  statusLog: Array<StatusLog>;
  sumPriceShown: PriceShown;
  variantId: Scalars['ID'];
  variantName: LocalizedItem;
}

export interface OrderItemConfigComponent {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  externalId?: Maybe<Scalars['String']>;
  name: LocalizedItem;
  netPackagingFee?: Maybe<Scalars['Float']>;
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
}

export interface OrderItemConfigComponentInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  externalId?: InputMaybe<Scalars['String']>;
  name: LocalizedItemInput;
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
}

export interface OrderItemConfigSet {
  items: Array<OrderItemConfigComponent>;
  name: LocalizedItem;
  productSetId: Scalars['ID'];
  type: ProductComponentSetType;
}

export interface OrderItemConfigSetInput {
  items: Array<OrderItemConfigComponentInput>;
  name: LocalizedItemInput;
  productSetId: Scalars['ID'];
  type: ProductComponentSetType;
}

export interface OrderItemInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  configSets?: InputMaybe<Array<OrderItemConfigSetInput>>;
  created?: InputMaybe<Scalars['Float']>;
  externalId?: InputMaybe<Scalars['String']>;
  image?: InputMaybe<Scalars['String']>;
  laneId?: InputMaybe<Scalars['ID']>;
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  priceShown: PriceShownInput;
  productId: Scalars['ID'];
  productName: LocalizedItemInput;
  productType?: InputMaybe<ProductType>;
  quantity: Scalars['Int'];
  serviceFee?: InputMaybe<PriceInput>;
  statusLog: Array<StatusLogInput>;
  sumPriceShown: PriceShownInput;
  variantId: Scalars['ID'];
  variantName: LocalizedItemInput;
}

export enum OrderMode {
  instant = 'instant',
  pickup = 'pickup'
}

export enum OrderPaymentPolicy {
  afterpay = 'afterpay',
  prepay = 'prepay'
}

export enum OrderPolicy {
  full = 'full',
  noorders = 'noOrders',
  placeonly = 'placeOnly',
  placewithpaymenttype = 'placeWithPaymentType'
}

export interface OrderRating {
  key: Scalars['String'];
  value: Scalars['Int'];
}

export interface OrderRatingInput {
  key: Scalars['String'];
  value: Scalars['Int'];
}

export enum OrderStatus {
  failed = 'failed',
  none = 'none',
  placed = 'placed',
  processing = 'processing',
  ready = 'ready',
  rejected = 'rejected',
  served = 'served'
}

export interface PayTipWithStripeInput {
  orderId: Scalars['ID'];
  tip: TipInput;
}

export enum PaymentMethod {
  card = 'card',
  cash = 'cash',
  inapp = 'inapp'
}

export interface PaymentMode {
  caption?: Maybe<Scalars['String']>;
  method: PaymentMethod;
  type: PaymentType;
}

export interface PaymentModeInput {
  caption?: InputMaybe<Scalars['String']>;
  method: PaymentMethod;
  type: PaymentType;
}

export enum PaymentStatus {
  failed = 'failed',
  success = 'success',
  waiting_for_payment = 'waiting_for_payment'
}

export enum PaymentType {
  applepay = 'applepay',
  card = 'card',
  cash = 'cash',
  googlepay = 'googlepay',
  simple = 'simple',
  stripe = 'stripe'
}

export interface Place {
  seat: Scalars['String'];
  table: Scalars['String'];
}

export interface PlaceInput {
  seat: Scalars['String'];
  table: Scalars['String'];
}

export interface Pos {
  rkeeper?: Maybe<RKeeper>;
  type: PosType;
}

export interface PosInput {
  rkeeper?: InputMaybe<RKeeperInput>;
  type: PosType;
}

export enum PosType {
  anyupp = 'anyupp',
  rkeeper = 'rkeeper'
}

export interface Price {
  currency: Scalars['String'];
  netPrice: Scalars['Float'];
  taxPercentage: Scalars['Float'];
}

export interface PriceInput {
  currency: Scalars['String'];
  netPrice: Scalars['Float'];
  taxPercentage: Scalars['Float'];
}

export interface PriceShown {
  currency: Scalars['String'];
  pricePerUnit: Scalars['Float'];
  priceSum: Scalars['Float'];
  tax: Scalars['Int'];
  taxSum: Scalars['Float'];
}

export interface PriceShownInput {
  currency: Scalars['String'];
  pricePerUnit: Scalars['Float'];
  priceSum: Scalars['Float'];
  tax: Scalars['Int'];
  taxSum: Scalars['Float'];
}

export interface ProductCategory {
  createdAt: Scalars['AWSDateTime'];
  description?: Maybe<LocalizedItem>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  name: LocalizedItem;
  ownerEntity: Scalars['ID'];
  parentId?: Maybe<Scalars['ID']>;
  position: Scalars['Int'];
  updatedAt: Scalars['AWSDateTime'];
}

export interface ProductComponent {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  createdAt: Scalars['AWSDateTime'];
  deletedAt?: Maybe<Scalars['AWSDateTime']>;
  description?: Maybe<Scalars['String']>;
  dirty?: Maybe<Scalars['Boolean']>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name: LocalizedItem;
  ownerEntity: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
}

export interface ProductComponentSet {
  createdAt: Scalars['AWSDateTime'];
  deletedAt?: Maybe<Scalars['AWSDateTime']>;
  description: Scalars['String'];
  dirty?: Maybe<Scalars['Boolean']>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  items: Array<Scalars['ID']>;
  maxSelection?: Maybe<Scalars['Int']>;
  name: LocalizedItem;
  ownerEntity: Scalars['ID'];
  supportedServingModes?: Maybe<Array<ServingMode>>;
  type: ProductComponentSetType;
  updatedAt: Scalars['AWSDateTime'];
}

export enum ProductComponentSetType {
  extras = 'extras',
  modifier = 'modifier',
  rkeeper = 'rkeeper'
}

export interface ProductConfigComponent {
  netPackagingFee?: Maybe<Scalars['Float']>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  soldOut?: Maybe<Scalars['Boolean']>;
}

export interface ProductConfigComponentInput {
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  soldOut?: InputMaybe<Scalars['Boolean']>;
}

export interface ProductConfigSet {
  items: Array<ProductConfigComponent>;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
}

export interface ProductConfigSetInput {
  items: Array<ProductConfigComponentInput>;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
}

export enum ProductType {
  dish = 'dish',
  drink = 'drink',
  food = 'food',
  other = 'other'
}

export interface ProductVariant {
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isAvailable: Scalars['Boolean'];
  netPackagingFee?: Maybe<Scalars['Float']>;
  ownerProduct?: Maybe<Scalars['ID']>;
  pack?: Maybe<ProductVariantPack>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: Maybe<Scalars['Boolean']>;
  variantName: LocalizedItem;
}

export interface ProductVariantInput {
  availabilities?: InputMaybe<Array<InputMaybe<AvailabilityInput>>>;
  externalId?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['ID']>;
  isAvailable: Scalars['Boolean'];
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  ownerProduct?: InputMaybe<Scalars['ID']>;
  pack?: InputMaybe<ProductVariantPackInput>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: InputMaybe<Scalars['Boolean']>;
  variantName: LocalizedItemInput;
}

export interface ProductVariantPack {
  size: Scalars['Float'];
  unit: Scalars['String'];
}

export interface ProductVariantPackInput {
  size: Scalars['Float'];
  unit: Scalars['String'];
}

export interface Query {
  getAdminUser?: Maybe<AdminUser>;
  getCart?: Maybe<Cart>;
  getFavoriteProduct?: Maybe<FavoriteProduct>;
  getInvoice?: Maybe<Invoice>;
  getOrder?: Maybe<Order>;
  getProductCategory?: Maybe<ProductCategory>;
  getProductComponent?: Maybe<ProductComponent>;
  getProductComponentSet?: Maybe<ProductComponentSet>;
  getReceipt?: Maybe<Receipt>;
  getTransaction?: Maybe<Transaction>;
  getUnit?: Maybe<Unit>;
  getUnitProduct?: Maybe<UnitProduct>;
  getUnitsNearLocation?: Maybe<GeoUnitList>;
  getUser?: Maybe<User>;
  getVariant?: Maybe<Variant>;
  listAdminUsers?: Maybe<ModelAdminUserConnection>;
  listCarts?: Maybe<ModelCartConnection>;
  listFavoriteProducts?: Maybe<ModelFavoriteProductConnection>;
  listInvoices?: Maybe<ModelInvoiceConnection>;
  listOrders?: Maybe<ModelOrderConnection>;
  listProductCategories?: Maybe<ModelProductCategoryConnection>;
  listProductComponentSets?: Maybe<ModelProductComponentSetConnection>;
  listProductComponents?: Maybe<ModelProductComponentConnection>;
  listReceipts?: Maybe<ModelReceiptConnection>;
  listStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
  listTransactions?: Maybe<ModelTransactionConnection>;
  listUnitProducts?: Maybe<ModelUnitProductConnection>;
  listUnits?: Maybe<ModelUnitConnection>;
  listUsers?: Maybe<ModelUserConnection>;
  listVariants?: Maybe<ModelVariantConnection>;
  searchAdminUsers?: Maybe<SearchableAdminUserConnection>;
  searchByRadius?: Maybe<GeoSearchConnection>;
  searchCarts?: Maybe<SearchableCartConnection>;
  searchFavoriteProducts?: Maybe<SearchableFavoriteProductConnection>;
  searchInvoices?: Maybe<SearchableInvoiceConnection>;
  searchOrders?: Maybe<SearchableOrderConnection>;
  searchProductCategories?: Maybe<SearchableProductCategoryConnection>;
  searchProductComponentSets?: Maybe<SearchableProductComponentSetConnection>;
  searchProductComponents?: Maybe<SearchableProductComponentConnection>;
  searchReceipts?: Maybe<SearchableReceiptConnection>;
  searchTransactions?: Maybe<SearchableTransactionConnection>;
  searchUnitProducts?: Maybe<SearchableUnitProductConnection>;
  searchUnits?: Maybe<SearchableUnitConnection>;
  searchUsers?: Maybe<SearchableUserConnection>;
  searchVariants?: Maybe<SearchableVariantConnection>;
}


export interface QueryGetAdminUserArgs {
  id: Scalars['ID'];
}


export interface QueryGetCartArgs {
  id: Scalars['ID'];
}


export interface QueryGetFavoriteProductArgs {
  id: Scalars['ID'];
}


export interface QueryGetInvoiceArgs {
  id: Scalars['ID'];
}


export interface QueryGetOrderArgs {
  id: Scalars['ID'];
}


export interface QueryGetProductCategoryArgs {
  id: Scalars['ID'];
}


export interface QueryGetProductComponentArgs {
  id: Scalars['ID'];
}


export interface QueryGetProductComponentSetArgs {
  id: Scalars['ID'];
}


export interface QueryGetReceiptArgs {
  id: Scalars['ID'];
}


export interface QueryGetTransactionArgs {
  id: Scalars['ID'];
}


export interface QueryGetUnitArgs {
  id: Scalars['ID'];
}


export interface QueryGetUnitProductArgs {
  id: Scalars['ID'];
}


export interface QueryGetUnitsNearLocationArgs {
  input: GetUnitsNearLocationInput;
}


export interface QueryGetUserArgs {
  id: Scalars['ID'];
}


export interface QueryGetVariantArgs {
  id: Scalars['ID'];
}


export interface QueryListAdminUsersArgs {
  filter?: InputMaybe<ModelAdminUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListCartsArgs {
  filter?: InputMaybe<ModelCartFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListFavoriteProductsArgs {
  filter?: InputMaybe<ModelFavoriteProductFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListInvoicesArgs {
  filter?: InputMaybe<ModelInvoiceFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListOrdersArgs {
  filter?: InputMaybe<ModelOrderFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListProductCategoriesArgs {
  filter?: InputMaybe<ModelProductCategoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListProductComponentSetsArgs {
  filter?: InputMaybe<ModelProductComponentSetFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListProductComponentsArgs {
  filter?: InputMaybe<ModelProductComponentFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListReceiptsArgs {
  filter?: InputMaybe<ModelReceiptFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListTransactionsArgs {
  filter?: InputMaybe<ModelTransactionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListUnitProductsArgs {
  filter?: InputMaybe<ModelUnitProductFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListUnitsArgs {
  filter?: InputMaybe<ModelUnitFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListUsersArgs {
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QueryListVariantsArgs {
  filter?: InputMaybe<ModelVariantFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}


export interface QuerySearchAdminUsersArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableAdminUserAggregationInput>>>;
  filter?: InputMaybe<SearchableAdminUserFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableAdminUserSortInput>>>;
}


export interface QuerySearchByRadiusArgs {
  input: SearchByRadiusInput;
}


export interface QuerySearchCartsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableCartAggregationInput>>>;
  filter?: InputMaybe<SearchableCartFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableCartSortInput>>>;
}


export interface QuerySearchFavoriteProductsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductAggregationInput>>>;
  filter?: InputMaybe<SearchableFavoriteProductFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductSortInput>>>;
}


export interface QuerySearchInvoicesArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableInvoiceAggregationInput>>>;
  filter?: InputMaybe<SearchableInvoiceFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableInvoiceSortInput>>>;
}


export interface QuerySearchOrdersArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableOrderAggregationInput>>>;
  filter?: InputMaybe<SearchableOrderFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableOrderSortInput>>>;
}


export interface QuerySearchProductCategoriesArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductCategoryAggregationInput>>>;
  filter?: InputMaybe<SearchableProductCategoryFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductCategorySortInput>>>;
}


export interface QuerySearchProductComponentSetsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetAggregationInput>>>;
  filter?: InputMaybe<SearchableProductComponentSetFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetSortInput>>>;
}


export interface QuerySearchProductComponentsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductComponentAggregationInput>>>;
  filter?: InputMaybe<SearchableProductComponentFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSortInput>>>;
}


export interface QuerySearchReceiptsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableReceiptAggregationInput>>>;
  filter?: InputMaybe<SearchableReceiptFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableReceiptSortInput>>>;
}


export interface QuerySearchTransactionsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableTransactionAggregationInput>>>;
  filter?: InputMaybe<SearchableTransactionFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableTransactionSortInput>>>;
}


export interface QuerySearchUnitProductsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUnitProductAggregationInput>>>;
  filter?: InputMaybe<SearchableUnitProductFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitProductSortInput>>>;
}


export interface QuerySearchUnitsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUnitAggregationInput>>>;
  filter?: InputMaybe<SearchableUnitFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitSortInput>>>;
}


export interface QuerySearchUsersArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUserAggregationInput>>>;
  filter?: InputMaybe<SearchableUserFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUserSortInput>>>;
}


export interface QuerySearchVariantsArgs {
  aggregates?: InputMaybe<Array<InputMaybe<SearchableVariantAggregationInput>>>;
  filter?: InputMaybe<SearchableVariantFilterInput>;
  from?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<InputMaybe<SearchableVariantSortInput>>>;
}

export interface RKeeper {
  anyuppPassword: Scalars['String'];
  anyuppUsername: Scalars['String'];
  endpointUri: Scalars['String'];
  rkeeperPassword: Scalars['String'];
  rkeeperUsername: Scalars['String'];
  waiterOrderId?: Maybe<Scalars['String']>;
}

export interface RKeeperInput {
  anyuppPassword: Scalars['String'];
  anyuppUsername: Scalars['String'];
  endpointUri: Scalars['String'];
  rkeeperPassword: Scalars['String'];
  rkeeperUsername: Scalars['String'];
}

export interface RateAndTipOrderInput {
  orderId: Scalars['ID'];
  rating?: InputMaybe<Scalars['Int']>;
  tip?: InputMaybe<TipInput>;
}

export interface RatingPolicy {
  description: LocalizedItem;
  key: Scalars['String'];
  ratings: Array<RatingPolicyItem>;
  title: LocalizedItem;
}

export interface RatingPolicyInput {
  description: LocalizedItemInput;
  key: Scalars['String'];
  ratings: Array<RatingPolicyItemInput>;
  title: LocalizedItemInput;
}

export interface RatingPolicyItem {
  icon?: Maybe<Scalars['String']>;
  text: LocalizedItem;
  value: Scalars['Int'];
}

export interface RatingPolicyItemInput {
  icon?: InputMaybe<Scalars['String']>;
  text: LocalizedItemInput;
  value: Scalars['Int'];
}

export interface Receipt {
  createdAt: Scalars['AWSDateTime'];
  email?: Maybe<Scalars['String']>;
  externalReceiptId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  orderId: Scalars['ID'];
  pdfData?: Maybe<Scalars['String']>;
  status: ReceiptStatus;
  transactionId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  userId: Scalars['ID'];
}

export enum ReceiptStatus {
  failed = 'failed',
  success = 'success',
  waiting = 'waiting'
}

export enum Role {
  chainadmin = 'chainadmin',
  groupadmin = 'groupadmin',
  inactive = 'inactive',
  staff = 'staff',
  superuser = 'superuser',
  unitadmin = 'unitadmin'
}

export interface SearchByRadiusInput {
  limit?: InputMaybe<Scalars['Int']>;
  location: LocationLatLonInput;
  nextToken?: InputMaybe<Scalars['String']>;
  objectType: GeoSearchableObjectType;
  radiusInMeters: Scalars['Float'];
}

export enum SearchableAdminUserAggregateField {
  createdat = 'createdAt',
  email = 'email',
  id = 'id',
  name = 'name',
  phone = 'phone',
  profileimage = 'profileImage',
  updatedat = 'updatedAt'
}

export interface SearchableAdminUserAggregationInput {
  field: SearchableAdminUserAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableAdminUserConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<AdminUser>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableAdminUserFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableAdminUserFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  email?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  name?: InputMaybe<SearchableStringFilterInput>;
  not?: InputMaybe<SearchableAdminUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableAdminUserFilterInput>>>;
  phone?: InputMaybe<SearchableStringFilterInput>;
  profileImage?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableAdminUserSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableAdminUserSortableFields>;
}

export enum SearchableAdminUserSortableFields {
  createdat = 'createdAt',
  email = 'email',
  id = 'id',
  name = 'name',
  phone = 'phone',
  profileimage = 'profileImage',
  updatedat = 'updatedAt'
}

export interface SearchableAggregateBucketResult {
  buckets?: Maybe<Array<Maybe<SearchableAggregateBucketResultItem>>>;
}

export interface SearchableAggregateBucketResultItem {
  doc_count: Scalars['Int'];
  key: Scalars['String'];
}

export type SearchableAggregateGenericResult = SearchableAggregateBucketResult | SearchableAggregateScalarResult;

export interface SearchableAggregateResult {
  name: Scalars['String'];
  result?: Maybe<SearchableAggregateGenericResult>;
}

export interface SearchableAggregateScalarResult {
  value: Scalars['Float'];
}

export enum SearchableAggregateType {
  avg = 'avg',
  max = 'max',
  min = 'min',
  sum = 'sum',
  terms = 'terms'
}

export interface SearchableBooleanFilterInput {
  eq?: InputMaybe<Scalars['Boolean']>;
  ne?: InputMaybe<Scalars['Boolean']>;
}

export enum SearchableCartAggregateField {
  createdat = 'createdAt',
  guestlabel = 'guestLabel',
  id = 'id',
  ordermode = 'orderMode',
  orderpolicy = 'orderPolicy',
  servingmode = 'servingMode',
  takeaway = 'takeAway',
  unitid = 'unitId',
  updatedat = 'updatedAt',
  userid = 'userId',
  version = 'version'
}

export interface SearchableCartAggregationInput {
  field: SearchableCartAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableCartConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Cart>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableCartFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableCartFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  guestLabel?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableCartFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableCartFilterInput>>>;
  orderMode?: InputMaybe<SearchableStringFilterInput>;
  orderPolicy?: InputMaybe<SearchableStringFilterInput>;
  servingMode?: InputMaybe<SearchableStringFilterInput>;
  takeAway?: InputMaybe<SearchableBooleanFilterInput>;
  unitId?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
  version?: InputMaybe<SearchableIntFilterInput>;
}

export interface SearchableCartSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableCartSortableFields>;
}

export enum SearchableCartSortableFields {
  createdat = 'createdAt',
  guestlabel = 'guestLabel',
  id = 'id',
  takeaway = 'takeAway',
  unitid = 'unitId',
  updatedat = 'updatedAt',
  userid = 'userId',
  version = 'version'
}

export enum SearchableFavoriteProductAggregateField {
  createdat = 'createdAt',
  id = 'id',
  unitid = 'unitId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export interface SearchableFavoriteProductAggregationInput {
  field: SearchableFavoriteProductAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableFavoriteProductConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<FavoriteProduct>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableFavoriteProductFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableFavoriteProductFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductFilterInput>>>;
  unitId?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
}

export interface SearchableFavoriteProductSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableFavoriteProductSortableFields>;
}

export enum SearchableFavoriteProductSortableFields {
  createdat = 'createdAt',
  id = 'id',
  unitid = 'unitId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export interface SearchableFloatFilterInput {
  eq?: InputMaybe<Scalars['Float']>;
  gt?: InputMaybe<Scalars['Float']>;
  gte?: InputMaybe<Scalars['Float']>;
  lt?: InputMaybe<Scalars['Float']>;
  lte?: InputMaybe<Scalars['Float']>;
  ne?: InputMaybe<Scalars['Float']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>;
}

export interface SearchableIdFilterInput {
  eq?: InputMaybe<Scalars['ID']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['ID']>;
  gte?: InputMaybe<Scalars['ID']>;
  lt?: InputMaybe<Scalars['ID']>;
  lte?: InputMaybe<Scalars['ID']>;
  match?: InputMaybe<Scalars['ID']>;
  matchPhrase?: InputMaybe<Scalars['ID']>;
  matchPhrasePrefix?: InputMaybe<Scalars['ID']>;
  multiMatch?: InputMaybe<Scalars['ID']>;
  ne?: InputMaybe<Scalars['ID']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>;
  regexp?: InputMaybe<Scalars['ID']>;
  wildcard?: InputMaybe<Scalars['ID']>;
}

export interface SearchableIntFilterInput {
  eq?: InputMaybe<Scalars['Int']>;
  gt?: InputMaybe<Scalars['Int']>;
  gte?: InputMaybe<Scalars['Int']>;
  lt?: InputMaybe<Scalars['Int']>;
  lte?: InputMaybe<Scalars['Int']>;
  ne?: InputMaybe<Scalars['Int']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>;
}

export enum SearchableInvoiceAggregateField {
  city = 'city',
  country = 'country',
  createdat = 'createdAt',
  customername = 'customerName',
  email = 'email',
  externalinvoiceid = 'externalInvoiceId',
  id = 'id',
  orderid = 'orderId',
  pdfurl = 'pdfUrl',
  postalcode = 'postalCode',
  status = 'status',
  streetaddress = 'streetAddress',
  taxnumber = 'taxNumber',
  transactionid = 'transactionId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export interface SearchableInvoiceAggregationInput {
  field: SearchableInvoiceAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableInvoiceConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Invoice>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableInvoiceFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableInvoiceFilterInput>>>;
  city?: InputMaybe<SearchableStringFilterInput>;
  country?: InputMaybe<SearchableStringFilterInput>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  customerName?: InputMaybe<SearchableStringFilterInput>;
  email?: InputMaybe<SearchableStringFilterInput>;
  externalInvoiceId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableInvoiceFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableInvoiceFilterInput>>>;
  orderId?: InputMaybe<SearchableIdFilterInput>;
  pdfUrl?: InputMaybe<SearchableStringFilterInput>;
  postalCode?: InputMaybe<SearchableStringFilterInput>;
  status?: InputMaybe<SearchableStringFilterInput>;
  streetAddress?: InputMaybe<SearchableStringFilterInput>;
  taxNumber?: InputMaybe<SearchableStringFilterInput>;
  transactionId?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
}

export interface SearchableInvoiceSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableInvoiceSortableFields>;
}

export enum SearchableInvoiceSortableFields {
  city = 'city',
  country = 'country',
  createdat = 'createdAt',
  customername = 'customerName',
  email = 'email',
  externalinvoiceid = 'externalInvoiceId',
  id = 'id',
  orderid = 'orderId',
  pdfurl = 'pdfUrl',
  postalcode = 'postalCode',
  streetaddress = 'streetAddress',
  taxnumber = 'taxNumber',
  transactionid = 'transactionId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export enum SearchableOrderAggregateField {
  archived = 'archived',
  createdat = 'createdAt',
  currentstatus = 'currentStatus',
  externalid = 'externalId',
  guestlabel = 'guestLabel',
  hasrated = 'hasRated',
  id = 'id',
  ordermode = 'orderMode',
  ordernum = 'orderNum',
  orderpolicy = 'orderPolicy',
  packagingfeetaxpercentage = 'packagingFeeTaxPercentage',
  paymentintention = 'paymentIntention',
  servingmode = 'servingMode',
  soldoutvisibilitypolicy = 'soldOutVisibilityPolicy',
  tiptransactionid = 'tipTransactionId',
  tiptransactionstatus = 'tipTransactionStatus',
  transactionid = 'transactionId',
  transactionstatus = 'transactionStatus',
  unitid = 'unitId',
  unpaycategory = 'unpayCategory',
  updatedat = 'updatedAt',
  userid = 'userId',
  version = 'version',
  visitid = 'visitId'
}

export interface SearchableOrderAggregationInput {
  field: SearchableOrderAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableOrderConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Order>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableOrderFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableOrderFilterInput>>>;
  archived?: InputMaybe<SearchableBooleanFilterInput>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  currentStatus?: InputMaybe<SearchableStringFilterInput>;
  externalId?: InputMaybe<SearchableStringFilterInput>;
  guestLabel?: InputMaybe<SearchableStringFilterInput>;
  hasRated?: InputMaybe<SearchableBooleanFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableOrderFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableOrderFilterInput>>>;
  orderMode?: InputMaybe<SearchableStringFilterInput>;
  orderNum?: InputMaybe<SearchableStringFilterInput>;
  orderPolicy?: InputMaybe<SearchableStringFilterInput>;
  packagingFeeTaxPercentage?: InputMaybe<SearchableFloatFilterInput>;
  paymentIntention?: InputMaybe<SearchableFloatFilterInput>;
  servingMode?: InputMaybe<SearchableStringFilterInput>;
  soldOutVisibilityPolicy?: InputMaybe<SearchableStringFilterInput>;
  tipTransactionId?: InputMaybe<SearchableIdFilterInput>;
  tipTransactionStatus?: InputMaybe<SearchableStringFilterInput>;
  transactionId?: InputMaybe<SearchableIdFilterInput>;
  transactionStatus?: InputMaybe<SearchableStringFilterInput>;
  unitId?: InputMaybe<SearchableIdFilterInput>;
  unpayCategory?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
  version?: InputMaybe<SearchableIntFilterInput>;
  visitId?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableOrderSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableOrderSortableFields>;
}

export enum SearchableOrderSortableFields {
  archived = 'archived',
  createdat = 'createdAt',
  externalid = 'externalId',
  guestlabel = 'guestLabel',
  hasrated = 'hasRated',
  id = 'id',
  ordernum = 'orderNum',
  packagingfeetaxpercentage = 'packagingFeeTaxPercentage',
  paymentintention = 'paymentIntention',
  tiptransactionid = 'tipTransactionId',
  transactionid = 'transactionId',
  unitid = 'unitId',
  updatedat = 'updatedAt',
  userid = 'userId',
  version = 'version',
  visitid = 'visitId'
}

export enum SearchableProductCategoryAggregateField {
  createdat = 'createdAt',
  id = 'id',
  image = 'image',
  ownerentity = 'ownerEntity',
  parentid = 'parentId',
  position = 'position',
  updatedat = 'updatedAt'
}

export interface SearchableProductCategoryAggregationInput {
  field: SearchableProductCategoryAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableProductCategoryConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<ProductCategory>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableProductCategoryFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableProductCategoryFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  image?: InputMaybe<SearchableStringFilterInput>;
  not?: InputMaybe<SearchableProductCategoryFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableProductCategoryFilterInput>>>;
  ownerEntity?: InputMaybe<SearchableIdFilterInput>;
  parentId?: InputMaybe<SearchableIdFilterInput>;
  position?: InputMaybe<SearchableIntFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableProductCategorySortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableProductCategorySortableFields>;
}

export enum SearchableProductCategorySortableFields {
  createdat = 'createdAt',
  id = 'id',
  image = 'image',
  ownerentity = 'ownerEntity',
  parentid = 'parentId',
  position = 'position',
  updatedat = 'updatedAt'
}

export enum SearchableProductComponentAggregateField {
  allergens = 'allergens',
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  description = 'description',
  dirty = 'dirty',
  externalid = 'externalId',
  id = 'id',
  ownerentity = 'ownerEntity',
  updatedat = 'updatedAt'
}

export interface SearchableProductComponentAggregationInput {
  field: SearchableProductComponentAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableProductComponentConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<ProductComponent>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableProductComponentFilterInput {
  allergens?: InputMaybe<SearchableStringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<SearchableProductComponentFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  deletedAt?: InputMaybe<SearchableStringFilterInput>;
  description?: InputMaybe<SearchableStringFilterInput>;
  dirty?: InputMaybe<SearchableBooleanFilterInput>;
  externalId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableProductComponentFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableProductComponentFilterInput>>>;
  ownerEntity?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export enum SearchableProductComponentSetAggregateField {
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  description = 'description',
  dirty = 'dirty',
  externalid = 'externalId',
  id = 'id',
  items = 'items',
  maxselection = 'maxSelection',
  ownerentity = 'ownerEntity',
  supportedservingmodes = 'supportedServingModes',
  type = 'type',
  updatedat = 'updatedAt'
}

export interface SearchableProductComponentSetAggregationInput {
  field: SearchableProductComponentSetAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableProductComponentSetConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<ProductComponentSet>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableProductComponentSetFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  deletedAt?: InputMaybe<SearchableStringFilterInput>;
  description?: InputMaybe<SearchableStringFilterInput>;
  dirty?: InputMaybe<SearchableBooleanFilterInput>;
  externalId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  items?: InputMaybe<SearchableIdFilterInput>;
  maxSelection?: InputMaybe<SearchableIntFilterInput>;
  not?: InputMaybe<SearchableProductComponentSetFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetFilterInput>>>;
  ownerEntity?: InputMaybe<SearchableIdFilterInput>;
  supportedServingModes?: InputMaybe<SearchableStringFilterInput>;
  type?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableProductComponentSetSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableProductComponentSetSortableFields>;
}

export enum SearchableProductComponentSetSortableFields {
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  description = 'description',
  dirty = 'dirty',
  externalid = 'externalId',
  id = 'id',
  items = 'items',
  maxselection = 'maxSelection',
  ownerentity = 'ownerEntity',
  updatedat = 'updatedAt'
}

export interface SearchableProductComponentSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableProductComponentSortableFields>;
}

export enum SearchableProductComponentSortableFields {
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  description = 'description',
  dirty = 'dirty',
  externalid = 'externalId',
  id = 'id',
  ownerentity = 'ownerEntity',
  updatedat = 'updatedAt'
}

export enum SearchableReceiptAggregateField {
  createdat = 'createdAt',
  email = 'email',
  externalreceiptid = 'externalReceiptId',
  id = 'id',
  orderid = 'orderId',
  pdfdata = 'pdfData',
  status = 'status',
  transactionid = 'transactionId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export interface SearchableReceiptAggregationInput {
  field: SearchableReceiptAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableReceiptConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Receipt>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableReceiptFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableReceiptFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  email?: InputMaybe<SearchableStringFilterInput>;
  externalReceiptId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableReceiptFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableReceiptFilterInput>>>;
  orderId?: InputMaybe<SearchableIdFilterInput>;
  pdfData?: InputMaybe<SearchableStringFilterInput>;
  status?: InputMaybe<SearchableStringFilterInput>;
  transactionId?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
}

export interface SearchableReceiptSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableReceiptSortableFields>;
}

export enum SearchableReceiptSortableFields {
  createdat = 'createdAt',
  email = 'email',
  externalreceiptid = 'externalReceiptId',
  id = 'id',
  orderid = 'orderId',
  pdfdata = 'pdfData',
  transactionid = 'transactionId',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export enum SearchableSortDirection {
  asc = 'asc',
  desc = 'desc'
}

export interface SearchableStringFilterInput {
  eq?: InputMaybe<Scalars['String']>;
  exists?: InputMaybe<Scalars['Boolean']>;
  gt?: InputMaybe<Scalars['String']>;
  gte?: InputMaybe<Scalars['String']>;
  lt?: InputMaybe<Scalars['String']>;
  lte?: InputMaybe<Scalars['String']>;
  match?: InputMaybe<Scalars['String']>;
  matchPhrase?: InputMaybe<Scalars['String']>;
  matchPhrasePrefix?: InputMaybe<Scalars['String']>;
  multiMatch?: InputMaybe<Scalars['String']>;
  ne?: InputMaybe<Scalars['String']>;
  range?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  regexp?: InputMaybe<Scalars['String']>;
  wildcard?: InputMaybe<Scalars['String']>;
}

export enum SearchableTransactionAggregateField {
  createdat = 'createdAt',
  currency = 'currency',
  externaltransactionid = 'externalTransactionId',
  id = 'id',
  invoiceid = 'invoiceId',
  orderid = 'orderId',
  paymentmethodid = 'paymentMethodId',
  receiptid = 'receiptId',
  status = 'status',
  total = 'total',
  type = 'type',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export interface SearchableTransactionAggregationInput {
  field: SearchableTransactionAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableTransactionConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Transaction>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableTransactionFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableTransactionFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  currency?: InputMaybe<SearchableStringFilterInput>;
  externalTransactionId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  invoiceId?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableTransactionFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableTransactionFilterInput>>>;
  orderId?: InputMaybe<SearchableIdFilterInput>;
  paymentMethodId?: InputMaybe<SearchableStringFilterInput>;
  receiptId?: InputMaybe<SearchableIdFilterInput>;
  status?: InputMaybe<SearchableStringFilterInput>;
  total?: InputMaybe<SearchableFloatFilterInput>;
  type?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
  userId?: InputMaybe<SearchableIdFilterInput>;
}

export interface SearchableTransactionSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableTransactionSortableFields>;
}

export enum SearchableTransactionSortableFields {
  createdat = 'createdAt',
  currency = 'currency',
  externaltransactionid = 'externalTransactionId',
  id = 'id',
  invoiceid = 'invoiceId',
  orderid = 'orderId',
  paymentmethodid = 'paymentMethodId',
  receiptid = 'receiptId',
  total = 'total',
  type = 'type',
  updatedat = 'updatedAt',
  userid = 'userId'
}

export enum SearchableUnitAggregateField {
  adbannersenabled = 'adBannersEnabled',
  cancallwaiter = 'canCallWaiter',
  canrequestvatinvoice = 'canRequestVatInvoice',
  createdat = 'createdAt',
  currency = 'currency',
  email = 'email',
  externalid = 'externalId',
  id = 'id',
  isacceptingorders = 'isAcceptingOrders',
  isactive = 'isActive',
  isvisibleinapp = 'isVisibleInApp',
  lastordernum = 'lastOrderNum',
  merchantid = 'merchantId',
  name = 'name',
  orderpaymentpolicy = 'orderPaymentPolicy',
  orderpolicy = 'orderPolicy',
  packagingtaxpercentage = 'packagingTaxPercentage',
  phone = 'phone',
  soldoutvisibilitypolicy = 'soldOutVisibilityPolicy',
  supportedordermodes = 'supportedOrderModes',
  supportedservingmodes = 'supportedServingModes',
  timezone = 'timeZone',
  updatedat = 'updatedAt'
}

export interface SearchableUnitAggregationInput {
  field: SearchableUnitAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableUnitConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Unit>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableUnitFilterInput {
  adBannersEnabled?: InputMaybe<SearchableBooleanFilterInput>;
  and?: InputMaybe<Array<InputMaybe<SearchableUnitFilterInput>>>;
  canCallWaiter?: InputMaybe<SearchableBooleanFilterInput>;
  canRequestVatInvoice?: InputMaybe<SearchableBooleanFilterInput>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  currency?: InputMaybe<SearchableStringFilterInput>;
  email?: InputMaybe<SearchableStringFilterInput>;
  externalId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  isAcceptingOrders?: InputMaybe<SearchableBooleanFilterInput>;
  isActive?: InputMaybe<SearchableBooleanFilterInput>;
  isVisibleInApp?: InputMaybe<SearchableBooleanFilterInput>;
  lastOrderNum?: InputMaybe<SearchableIntFilterInput>;
  merchantId?: InputMaybe<SearchableStringFilterInput>;
  name?: InputMaybe<SearchableStringFilterInput>;
  not?: InputMaybe<SearchableUnitFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableUnitFilterInput>>>;
  orderPaymentPolicy?: InputMaybe<SearchableStringFilterInput>;
  orderPolicy?: InputMaybe<SearchableStringFilterInput>;
  packagingTaxPercentage?: InputMaybe<SearchableFloatFilterInput>;
  phone?: InputMaybe<SearchableStringFilterInput>;
  soldOutVisibilityPolicy?: InputMaybe<SearchableStringFilterInput>;
  supportedOrderModes?: InputMaybe<SearchableStringFilterInput>;
  supportedServingModes?: InputMaybe<SearchableStringFilterInput>;
  timeZone?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export enum SearchableUnitProductAggregateField {
  allergens = 'allergens',
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  dirty = 'dirty',
  id = 'id',
  image = 'image',
  isvisible = 'isVisible',
  laneid = 'laneId',
  position = 'position',
  productcategoryid = 'productCategoryId',
  producttype = 'productType',
  supportedservingmodes = 'supportedServingModes',
  takeaway = 'takeaway',
  takeawaytax = 'takeawayTax',
  tax = 'tax',
  unitid = 'unitId',
  updatedat = 'updatedAt'
}

export interface SearchableUnitProductAggregationInput {
  field: SearchableUnitProductAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableUnitProductConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<UnitProduct>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableUnitProductFilterInput {
  allergens?: InputMaybe<SearchableStringFilterInput>;
  and?: InputMaybe<Array<InputMaybe<SearchableUnitProductFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  deletedAt?: InputMaybe<SearchableStringFilterInput>;
  dirty?: InputMaybe<SearchableBooleanFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  image?: InputMaybe<SearchableStringFilterInput>;
  isVisible?: InputMaybe<SearchableBooleanFilterInput>;
  laneId?: InputMaybe<SearchableIdFilterInput>;
  not?: InputMaybe<SearchableUnitProductFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableUnitProductFilterInput>>>;
  position?: InputMaybe<SearchableIntFilterInput>;
  productCategoryId?: InputMaybe<SearchableIdFilterInput>;
  productType?: InputMaybe<SearchableStringFilterInput>;
  supportedServingModes?: InputMaybe<SearchableStringFilterInput>;
  takeaway?: InputMaybe<SearchableBooleanFilterInput>;
  takeawayTax?: InputMaybe<SearchableIntFilterInput>;
  tax?: InputMaybe<SearchableIntFilterInput>;
  unitId?: InputMaybe<SearchableIdFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableUnitProductSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableUnitProductSortableFields>;
}

export enum SearchableUnitProductSortableFields {
  createdat = 'createdAt',
  deletedat = 'deletedAt',
  dirty = 'dirty',
  id = 'id',
  image = 'image',
  isvisible = 'isVisible',
  laneid = 'laneId',
  position = 'position',
  productcategoryid = 'productCategoryId',
  takeaway = 'takeaway',
  takeawaytax = 'takeawayTax',
  tax = 'tax',
  unitid = 'unitId',
  updatedat = 'updatedAt'
}

export interface SearchableUnitSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableUnitSortableFields>;
}

export enum SearchableUnitSortableFields {
  adbannersenabled = 'adBannersEnabled',
  cancallwaiter = 'canCallWaiter',
  canrequestvatinvoice = 'canRequestVatInvoice',
  createdat = 'createdAt',
  currency = 'currency',
  email = 'email',
  externalid = 'externalId',
  id = 'id',
  isacceptingorders = 'isAcceptingOrders',
  isactive = 'isActive',
  isvisibleinapp = 'isVisibleInApp',
  lastordernum = 'lastOrderNum',
  merchantid = 'merchantId',
  name = 'name',
  packagingtaxpercentage = 'packagingTaxPercentage',
  phone = 'phone',
  timezone = 'timeZone',
  updatedat = 'updatedAt'
}

export enum SearchableUserAggregateField {
  createdat = 'createdAt',
  email = 'email',
  id = 'id',
  name = 'name',
  phone = 'phone',
  profileimage = 'profileImage',
  stripecustomerid = 'stripeCustomerId',
  updatedat = 'updatedAt'
}

export interface SearchableUserAggregationInput {
  field: SearchableUserAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableUserConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<User>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableUserFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableUserFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  email?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  name?: InputMaybe<SearchableStringFilterInput>;
  not?: InputMaybe<SearchableUserFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableUserFilterInput>>>;
  phone?: InputMaybe<SearchableStringFilterInput>;
  profileImage?: InputMaybe<SearchableStringFilterInput>;
  stripeCustomerId?: InputMaybe<SearchableStringFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableUserSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableUserSortableFields>;
}

export enum SearchableUserSortableFields {
  createdat = 'createdAt',
  email = 'email',
  id = 'id',
  name = 'name',
  phone = 'phone',
  profileimage = 'profileImage',
  stripecustomerid = 'stripeCustomerId',
  updatedat = 'updatedAt'
}

export enum SearchableVariantAggregateField {
  createdat = 'createdAt',
  externalid = 'externalId',
  id = 'id',
  isavailable = 'isAvailable',
  netpackagingfee = 'netPackagingFee',
  ownerproduct = 'ownerProduct',
  position = 'position',
  price = 'price',
  soldout = 'soldOut',
  updatedat = 'updatedAt'
}

export interface SearchableVariantAggregationInput {
  field: SearchableVariantAggregateField;
  name: Scalars['String'];
  type: SearchableAggregateType;
}

export interface SearchableVariantConnection {
  aggregateItems: Array<Maybe<SearchableAggregateResult>>;
  items: Array<Maybe<Variant>>;
  nextToken?: Maybe<Scalars['String']>;
  total?: Maybe<Scalars['Int']>;
}

export interface SearchableVariantFilterInput {
  and?: InputMaybe<Array<InputMaybe<SearchableVariantFilterInput>>>;
  createdAt?: InputMaybe<SearchableStringFilterInput>;
  externalId?: InputMaybe<SearchableStringFilterInput>;
  id?: InputMaybe<SearchableIdFilterInput>;
  isAvailable?: InputMaybe<SearchableBooleanFilterInput>;
  netPackagingFee?: InputMaybe<SearchableFloatFilterInput>;
  not?: InputMaybe<SearchableVariantFilterInput>;
  or?: InputMaybe<Array<InputMaybe<SearchableVariantFilterInput>>>;
  ownerProduct?: InputMaybe<SearchableStringFilterInput>;
  position?: InputMaybe<SearchableIntFilterInput>;
  price?: InputMaybe<SearchableFloatFilterInput>;
  soldOut?: InputMaybe<SearchableBooleanFilterInput>;
  updatedAt?: InputMaybe<SearchableStringFilterInput>;
}

export interface SearchableVariantSortInput {
  direction?: InputMaybe<SearchableSortDirection>;
  field?: InputMaybe<SearchableVariantSortableFields>;
}

export enum SearchableVariantSortableFields {
  createdat = 'createdAt',
  externalid = 'externalId',
  id = 'id',
  isavailable = 'isAvailable',
  netpackagingfee = 'netPackagingFee',
  ownerproduct = 'ownerProduct',
  position = 'position',
  price = 'price',
  soldout = 'soldOut',
  updatedat = 'updatedAt'
}

export interface ServiceFeePolicy {
  percentage: Scalars['Float'];
  type: ServiceFeeType;
}

export interface ServiceFeePolicyInput {
  percentage: Scalars['Float'];
  type: ServiceFeeType;
}

export enum ServiceFeeType {
  applicable = 'applicable',
  included = 'included',
  nofee = 'noFee'
}

export enum ServingMode {
  inplace = 'inPlace',
  takeaway = 'takeAway'
}

export enum SoldOutVisibilityPolicy {
  faded = 'faded',
  invisible = 'invisible'
}

export interface StartStripePaymentInput {
  invoiceAddress?: InputMaybe<UserInvoiceAddressInput>;
  orderId: Scalars['ID'];
  paymentMethod: PaymentMethod;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  savePaymentMethod: Scalars['Boolean'];
}

export interface StartStripePaymentOutput {
  clientSecret: Scalars['String'];
  paymentMethodId?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  stripeAccount?: Maybe<Scalars['String']>;
}

export interface StatusLog {
  status: OrderStatus;
  ts: Scalars['Float'];
  userId: Scalars['ID'];
}

export interface StatusLogInput {
  status: OrderStatus;
  ts: Scalars['Float'];
  userId: Scalars['ID'];
}

export interface StripeCard {
  billing_details?: Maybe<BillingDetails>;
  brand?: Maybe<CardBrand>;
  checks?: Maybe<CardChecks>;
  country?: Maybe<Scalars['String']>;
  createdAt: Scalars['AWSDateTime'];
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  id: Scalars['String'];
  last4?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  three_d_secure?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
}

export interface StripeCardCreateInput {
  card_number: Scalars['String'];
  cvc: Scalars['String'];
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
  exp_month: Scalars['Int'];
  exp_year: Scalars['Int'];
  name: Scalars['String'];
}

export interface StripeCardDeleteInput {
  paymentMethodId: Scalars['String'];
}

export interface StripeCardUpdateInput {
  default_for_currency?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  paymentMethodId: Scalars['String'];
}

export interface Subscription {
  onAdminUserChange?: Maybe<AdminUser>;
  onAdminUsersChange?: Maybe<AdminUser>;
  onCreateCart?: Maybe<Cart>;
  onCreateFavoriteProduct?: Maybe<FavoriteProduct>;
  onCreateInvoice?: Maybe<Invoice>;
  onCreateProductCategory?: Maybe<ProductCategory>;
  onCreateProductComponent?: Maybe<ProductComponent>;
  onCreateProductComponentSet?: Maybe<ProductComponentSet>;
  onCreateReceipt?: Maybe<Receipt>;
  onCreateTransaction?: Maybe<Transaction>;
  onCreateUnitProduct?: Maybe<UnitProduct>;
  onCreateUser?: Maybe<User>;
  onCreateVariant?: Maybe<Variant>;
  onDeleteCart?: Maybe<Cart>;
  onDeleteFavoriteProduct?: Maybe<FavoriteProduct>;
  onDeleteInvoice?: Maybe<Invoice>;
  onDeleteOrder?: Maybe<Order>;
  onDeleteProductCategory?: Maybe<ProductCategory>;
  onDeleteProductComponent?: Maybe<ProductComponent>;
  onDeleteProductComponentSet?: Maybe<ProductComponentSet>;
  onDeleteReceipt?: Maybe<Receipt>;
  onDeleteTransaction?: Maybe<Transaction>;
  onDeleteUnit?: Maybe<Unit>;
  onDeleteUnitProduct?: Maybe<UnitProduct>;
  onDeleteUser?: Maybe<User>;
  onDeleteVariant?: Maybe<Variant>;
  onOrderChanged?: Maybe<Order>;
  onOrdersChange?: Maybe<Order>;
  onOrdersDelete?: Maybe<Order>;
  onProductCategoriesChange?: Maybe<ProductCategory>;
  onProductComponentSetsChange?: Maybe<ProductComponentSet>;
  onProductComponentsChange?: Maybe<ProductComponent>;
  onUnitOrdersChange?: Maybe<Order>;
  onUnitProductChange?: Maybe<UnitProduct>;
  onUpdateAdminUser?: Maybe<AdminUser>;
  onUpdateCart?: Maybe<Cart>;
  onUpdateFavoriteProduct?: Maybe<FavoriteProduct>;
  onUpdateInvoice?: Maybe<Invoice>;
  onUpdateOrder?: Maybe<Order>;
  onUpdateProductCategory?: Maybe<ProductCategory>;
  onUpdateProductComponent?: Maybe<ProductComponent>;
  onUpdateProductComponentSet?: Maybe<ProductComponentSet>;
  onUpdateReceipt?: Maybe<Receipt>;
  onUpdateTransaction?: Maybe<Transaction>;
  onUpdateUnitProduct?: Maybe<UnitProduct>;
  onUpdateUser?: Maybe<User>;
  onUpdateVariant?: Maybe<Variant>;
}


export interface SubscriptionOnAdminUserChangeArgs {
  id: Scalars['ID'];
}


export interface SubscriptionOnOrderChangedArgs {
  archived?: InputMaybe<Scalars['Boolean']>;
  unitId?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['String']>;
}


export interface SubscriptionOnProductCategoriesChangeArgs {
  unitId: Scalars['ID'];
}


export interface SubscriptionOnProductComponentSetsChangeArgs {
  unitId: Scalars['ID'];
}


export interface SubscriptionOnProductComponentsChangeArgs {
  unitId: Scalars['ID'];
}


export interface SubscriptionOnUnitOrdersChangeArgs {
  archived?: InputMaybe<Scalars['Boolean']>;
  unitId?: InputMaybe<Scalars['String']>;
}


export interface SubscriptionOnUnitProductChangeArgs {
  unitId: Scalars['ID'];
}

export interface Tip {
  type: TipType;
  value: Scalars['Float'];
}

export interface TipInput {
  type: TipType;
  value: Scalars['Float'];
}

export interface TipPolicy {
  description?: Maybe<LocalizedItem>;
  minOtherAmount?: Maybe<Scalars['Float']>;
  percents: Array<Scalars['Float']>;
  title?: Maybe<LocalizedItem>;
}

export interface TipPolicyInput {
  description?: InputMaybe<LocalizedItemInput>;
  minOtherAmount?: InputMaybe<Scalars['Float']>;
  percents: Array<Scalars['Float']>;
  title?: InputMaybe<LocalizedItemInput>;
}

export enum TipType {
  amount = 'amount',
  none = 'none',
  percent = 'percent'
}

export interface Transaction {
  createdAt: Scalars['AWSDateTime'];
  currency?: Maybe<Scalars['String']>;
  externalTransactionId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  invoice?: Maybe<Invoice>;
  invoiceId?: Maybe<Scalars['ID']>;
  orderId: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['String']>;
  receipt?: Maybe<Receipt>;
  receiptId?: Maybe<Scalars['ID']>;
  status?: Maybe<PaymentStatus>;
  total?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
  user: User;
  userId: Scalars['ID'];
}

export interface Unit {
  adBanners?: Maybe<Array<ImageAsset>>;
  adBannersEnabled?: Maybe<Scalars['Boolean']>;
  address: Address;
  canCallWaiter?: Maybe<Scalars['Boolean']>;
  canRequestVatInvoice?: Maybe<Scalars['Boolean']>;
  categoryOrders?: Maybe<Array<Maybe<NestedSortItem>>>;
  coverBanners?: Maybe<Array<ImageAsset>>;
  createdAt: Scalars['AWSDateTime'];
  currency: Scalars['String'];
  description?: Maybe<LocalizedItem>;
  email?: Maybe<Scalars['String']>;
  externalId?: Maybe<Scalars['String']>;
  floorMap?: Maybe<FloorMapData>;
  id: Scalars['ID'];
  isAcceptingOrders: Scalars['Boolean'];
  isActive: Scalars['Boolean'];
  isVisibleInApp?: Maybe<Scalars['Boolean']>;
  lanes?: Maybe<Array<Maybe<Lane>>>;
  lastOrderNum?: Maybe<Scalars['Int']>;
  location: LocationLatLon;
  merchantId?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  open?: Maybe<DateIntervalOpen>;
  openingHours?: Maybe<WeeklySchedule>;
  orderPaymentPolicy?: Maybe<OrderPaymentPolicy>;
  orderPolicy?: Maybe<OrderPolicy>;
  packagingTaxPercentage?: Maybe<Scalars['Float']>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  phone?: Maybe<Scalars['String']>;
  pos?: Maybe<Pos>;
  ratingPolicies?: Maybe<Array<RatingPolicy>>;
  serviceFeePolicy?: Maybe<ServiceFeePolicy>;
  soldOutVisibilityPolicy?: Maybe<SoldOutVisibilityPolicy>;
  style: ChainStyle;
  supportedOrderModes?: Maybe<Array<OrderMode>>;
  supportedServingModes?: Maybe<Array<ServingMode>>;
  timeZone?: Maybe<Scalars['String']>;
  tipPolicy?: Maybe<TipPolicy>;
  updatedAt: Scalars['AWSDateTime'];
}

export enum UnitMapObjectType {
  counter = 'counter',
  label = 'label',
  seat_c = 'seat_c',
  seat_r = 'seat_r',
  table_c = 'table_c',
  table_r = 'table_r',
  wall = 'wall'
}

export interface UnitProduct {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  configSets?: Maybe<Array<Maybe<ProductConfigSet>>>;
  createdAt: Scalars['AWSDateTime'];
  deletedAt?: Maybe<Scalars['AWSDateTime']>;
  description?: Maybe<LocalizedItem>;
  dirty?: Maybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isVisible: Scalars['Boolean'];
  laneId?: Maybe<Scalars['ID']>;
  name: LocalizedItem;
  position: Scalars['Int'];
  productCategoryId: Scalars['ID'];
  productType: ProductType;
  supportedServingModes?: Maybe<Array<ServingMode>>;
  /** @deprecated Use `supportedServingModes`. */
  takeaway?: Maybe<Scalars['Boolean']>;
  takeawayTax?: Maybe<Scalars['Int']>;
  tax: Scalars['Int'];
  unitId: Scalars['ID'];
  updatedAt: Scalars['AWSDateTime'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export enum UnpayCategory {
  coupon = 'coupon',
  delivery = 'delivery',
  error_cooked = 'error_cooked',
  error_no_cooked = 'error_no_cooked',
  event = 'event',
  manager_meal = 'manager_meal',
  marketing_promo = 'marketing_promo',
  other = 'other',
  payment_mode_change = 'payment_mode_change',
  staff_meal = 'staff_meal'
}

export interface UpdateAdminUserInput {
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
  settings?: InputMaybe<AdminUserSettingsInput>;
}

export interface UpdateCartInput {
  guestLabel?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  items?: InputMaybe<Array<OrderItemInput>>;
  orderMode?: InputMaybe<OrderMode>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  paymentMode?: InputMaybe<PaymentModeInput>;
  place?: InputMaybe<PlaceInput>;
  servingMode?: InputMaybe<ServingMode>;
  takeAway?: InputMaybe<Scalars['Boolean']>;
  unitId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
  version?: InputMaybe<Scalars['Int']>;
}

export interface UpdateFavoriteProductInput {
  id: Scalars['ID'];
  product?: InputMaybe<GeneratedProductInput>;
  unitId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
}

export interface UpdateInvoiceInput {
  city?: InputMaybe<Scalars['String']>;
  country?: InputMaybe<Scalars['String']>;
  customerName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  externalInvoiceId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  orderId?: InputMaybe<Scalars['ID']>;
  pdfUrl?: InputMaybe<Scalars['String']>;
  postalCode?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<InvoiceStatus>;
  streetAddress?: InputMaybe<Scalars['String']>;
  taxNumber?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
}

export interface UpdateOrderInput {
  archived?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  currentStatus?: InputMaybe<OrderStatus>;
  externalId?: InputMaybe<Scalars['String']>;
  guestLabel?: InputMaybe<Scalars['String']>;
  hasRated?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  items?: InputMaybe<Array<OrderItemInput>>;
  orderMode?: InputMaybe<OrderMode>;
  orderNum?: InputMaybe<Scalars['String']>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  packagingFeeTaxPercentage?: InputMaybe<Scalars['Float']>;
  packagingSum?: InputMaybe<PriceInput>;
  paymentIntention?: InputMaybe<Scalars['Float']>;
  paymentMode?: InputMaybe<PaymentModeInput>;
  place?: InputMaybe<PlaceInput>;
  rating?: InputMaybe<OrderRatingInput>;
  ratingPolicies?: InputMaybe<Array<RatingPolicyInput>>;
  serviceFee?: InputMaybe<CumulatedPriceInput>;
  serviceFeePolicy?: InputMaybe<ServiceFeePolicyInput>;
  servingMode?: InputMaybe<ServingMode>;
  soldOutVisibilityPolicy?: InputMaybe<SoldOutVisibilityPolicy>;
  statusLog?: InputMaybe<Array<StatusLogInput>>;
  sumPriceShown?: InputMaybe<PriceShownInput>;
  tip?: InputMaybe<TipInput>;
  tipPolicy?: InputMaybe<TipPolicyInput>;
  tipTransactionId?: InputMaybe<Scalars['ID']>;
  tipTransactionStatus?: InputMaybe<PaymentStatus>;
  transactionId?: InputMaybe<Scalars['ID']>;
  transactionStatus?: InputMaybe<PaymentStatus>;
  unitId?: InputMaybe<Scalars['ID']>;
  unpayCategory?: InputMaybe<UnpayCategory>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  userId?: InputMaybe<Scalars['ID']>;
  version?: InputMaybe<Scalars['Int']>;
  visitId?: InputMaybe<Scalars['String']>;
}

export interface UpdateProductCategoryInput {
  description?: InputMaybe<LocalizedItemInput>;
  id: Scalars['ID'];
  image?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<LocalizedItemInput>;
  ownerEntity?: InputMaybe<Scalars['ID']>;
  parentId?: InputMaybe<Scalars['ID']>;
  position?: InputMaybe<Scalars['Int']>;
}

export interface UpdateProductComponentInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  dirty?: InputMaybe<Scalars['Boolean']>;
  externalId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<LocalizedItemInput>;
  ownerEntity?: InputMaybe<Scalars['ID']>;
}

export interface UpdateProductComponentSetInput {
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<Scalars['String']>;
  dirty?: InputMaybe<Scalars['Boolean']>;
  externalId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  items?: InputMaybe<Array<Scalars['ID']>>;
  maxSelection?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<LocalizedItemInput>;
  ownerEntity?: InputMaybe<Scalars['ID']>;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  type?: InputMaybe<ProductComponentSetType>;
}

export interface UpdateRKeeperDataInput {
  anyuppPassword?: InputMaybe<Scalars['String']>;
  anyuppUsername?: InputMaybe<Scalars['String']>;
  endpointUri?: InputMaybe<Scalars['String']>;
  rkeeperPassword?: InputMaybe<Scalars['String']>;
  rkeeperUsername?: InputMaybe<Scalars['String']>;
  unitId: Scalars['ID'];
  waiterOrderId?: InputMaybe<Scalars['String']>;
}

export interface UpdateReceiptInput {
  email?: InputMaybe<Scalars['String']>;
  externalReceiptId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  orderId?: InputMaybe<Scalars['ID']>;
  pdfData?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<ReceiptStatus>;
  transactionId?: InputMaybe<Scalars['ID']>;
  userId?: InputMaybe<Scalars['ID']>;
}

export interface UpdateTransactionInput {
  createdAt?: InputMaybe<Scalars['AWSDateTime']>;
  currency?: InputMaybe<Scalars['String']>;
  externalTransactionId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  invoiceId?: InputMaybe<Scalars['ID']>;
  orderId?: InputMaybe<Scalars['ID']>;
  paymentMethodId?: InputMaybe<Scalars['String']>;
  receiptId?: InputMaybe<Scalars['ID']>;
  status?: InputMaybe<PaymentStatus>;
  total?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['AWSDateTime']>;
  userId?: InputMaybe<Scalars['ID']>;
}

export interface UpdateUnitInput {
  adBanners?: InputMaybe<Array<InputMaybe<ImageAssetInput>>>;
  adBannersEnabled?: InputMaybe<Scalars['Boolean']>;
  address?: InputMaybe<AddressInput>;
  canCallWaiter?: InputMaybe<Scalars['Boolean']>;
  canRequestVatInvoice?: InputMaybe<Scalars['Boolean']>;
  categoryOrders?: InputMaybe<Array<InputMaybe<NestedSortItemInput>>>;
  coverBanners?: InputMaybe<Array<InputMaybe<ImageAssetInput>>>;
  coverBannersEnabled?: InputMaybe<Scalars['Boolean']>;
  currency?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<LocalizedItemInput>;
  email?: InputMaybe<Scalars['String']>;
  externalId?: InputMaybe<Scalars['String']>;
  floorMap?: InputMaybe<FloorMapDataInput>;
  id: Scalars['ID'];
  isAcceptingOrders?: InputMaybe<Scalars['Boolean']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  isVisibleInApp?: InputMaybe<Scalars['Boolean']>;
  lanes?: InputMaybe<Array<InputMaybe<LaneInput>>>;
  lastOrderNum?: InputMaybe<Scalars['Int']>;
  location?: InputMaybe<LocationLatLonInput>;
  merchantId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  open?: InputMaybe<DateIntervalInput>;
  openingHours?: InputMaybe<WeeklyScheduleInput>;
  orderPaymentPolicy?: InputMaybe<OrderPaymentPolicy>;
  orderPolicy?: InputMaybe<OrderPolicy>;
  packagingTaxPercentage?: InputMaybe<Scalars['Float']>;
  paymentModes?: InputMaybe<Array<InputMaybe<PaymentModeInput>>>;
  phone?: InputMaybe<Scalars['String']>;
  pos?: InputMaybe<PosInput>;
  ratingPolicies?: InputMaybe<Array<RatingPolicyInput>>;
  serviceFeePolicy?: InputMaybe<ServiceFeePolicyInput>;
  soldOutVisibilityPolicy?: InputMaybe<SoldOutVisibilityPolicy>;
  style?: InputMaybe<ChainStyleInput>;
  supportedOrderModes?: InputMaybe<Array<OrderMode>>;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  timeZone?: InputMaybe<Scalars['String']>;
  tipPolicy?: InputMaybe<TipPolicyInput>;
}

export interface UpdateUnitProductInput {
  allergens?: InputMaybe<Array<InputMaybe<Allergen>>>;
  configSets?: InputMaybe<Array<InputMaybe<ProductConfigSetInput>>>;
  deletedAt?: InputMaybe<Scalars['AWSDateTime']>;
  description?: InputMaybe<LocalizedItemInput>;
  dirty?: InputMaybe<Scalars['Boolean']>;
  id: Scalars['ID'];
  image?: InputMaybe<Scalars['String']>;
  isVisible?: InputMaybe<Scalars['Boolean']>;
  laneId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<LocalizedItemInput>;
  position?: InputMaybe<Scalars['Int']>;
  productCategoryId?: InputMaybe<Scalars['ID']>;
  productType?: InputMaybe<ProductType>;
  supportedServingModes?: InputMaybe<Array<ServingMode>>;
  takeaway?: InputMaybe<Scalars['Boolean']>;
  takeawayTax?: InputMaybe<Scalars['Int']>;
  tax?: InputMaybe<Scalars['Int']>;
  unitId?: InputMaybe<Scalars['ID']>;
  variants?: InputMaybe<Array<InputMaybe<ProductVariantInput>>>;
}

export interface UpdateUserInput {
  email?: InputMaybe<Scalars['String']>;
  fcmTokens?: InputMaybe<Array<FcmTokenInput>>;
  id: Scalars['ID'];
  invoiceAddress?: InputMaybe<UserInvoiceAddressInput>;
  name?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  profileImage?: InputMaybe<Scalars['String']>;
  stripeCustomerId?: InputMaybe<Scalars['String']>;
}

export interface UpdateVariantInput {
  availabilities?: InputMaybe<Array<InputMaybe<AvailabilityInput>>>;
  externalId?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  isAvailable?: InputMaybe<Scalars['Boolean']>;
  netPackagingFee?: InputMaybe<Scalars['Float']>;
  ownerProduct?: InputMaybe<Scalars['String']>;
  pack?: InputMaybe<ProductVariantPackInput>;
  position?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Float']>;
  soldOut?: InputMaybe<Scalars['Boolean']>;
  variantName?: InputMaybe<LocalizedItemInput>;
}

export interface User {
  createdAt: Scalars['AWSDateTime'];
  email?: Maybe<Scalars['String']>;
  fcmTokens?: Maybe<Array<FcmToken>>;
  id: Scalars['ID'];
  invoiceAddress?: Maybe<UserInvoiceAddress>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  stripeCustomerId?: Maybe<Scalars['String']>;
  updatedAt: Scalars['AWSDateTime'];
}

export interface UserInvoiceAddress {
  city: Scalars['String'];
  country: Scalars['String'];
  customerName: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  streetAddress: Scalars['String'];
  taxNumber: Scalars['String'];
}

export interface UserInvoiceAddressInput {
  city: Scalars['String'];
  country: Scalars['String'];
  customerName: Scalars['String'];
  email?: InputMaybe<Scalars['String']>;
  postalCode: Scalars['String'];
  streetAddress: Scalars['String'];
  taxNumber: Scalars['String'];
}

export interface Variant {
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  createdAt: Scalars['AWSDateTime'];
  externalId?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  isAvailable: Scalars['Boolean'];
  netPackagingFee?: Maybe<Scalars['Float']>;
  ownerProduct: Scalars['String'];
  pack?: Maybe<ProductVariantPack>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  soldOut?: Maybe<Scalars['Boolean']>;
  updatedAt: Scalars['AWSDateTime'];
  variantName: LocalizedItem;
}

export interface WeeklySchedule {
  custom?: Maybe<Array<Maybe<CustomDailySchedule>>>;
  fri?: Maybe<DateInterval>;
  mon?: Maybe<DateInterval>;
  sat?: Maybe<DateInterval>;
  sun?: Maybe<DateInterval>;
  thu?: Maybe<DateInterval>;
  tue?: Maybe<DateInterval>;
  wed?: Maybe<DateInterval>;
}

export interface WeeklyScheduleInput {
  custom?: InputMaybe<Array<InputMaybe<CustomDailyScheduleInput>>>;
  fri?: InputMaybe<DateIntervalInput>;
  mon?: InputMaybe<DateIntervalInput>;
  sat?: InputMaybe<DateIntervalInput>;
  sun?: InputMaybe<DateIntervalInput>;
  thu?: InputMaybe<DateIntervalInput>;
  tue?: InputMaybe<DateIntervalInput>;
  wed?: InputMaybe<DateIntervalInput>;
}

export type SearchReportOrdersQueryVariables = Exact<{
  filter?: InputMaybe<SearchableOrderFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableOrderSortInput>> | InputMaybe<SearchableOrderSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchReportOrdersQuery = { searchOrders?: { nextToken?: string | null, items: Array<{ createdAt: string, userId: string, sumPriceShown: { currency: string, priceSum: number } } | null> } | null };

export type SearchUnitIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableUnitFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitSortInput>> | InputMaybe<SearchableUnitSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchUnitIdsQuery = { searchUnits?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchUnitProductIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableUnitProductFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitProductSortInput>> | InputMaybe<SearchableUnitProductSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchUnitProductIdsQuery = { searchUnitProducts?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchProductCategoryIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductCategoryFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductCategorySortInput>> | InputMaybe<SearchableProductCategorySortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchProductCategoryIdsQuery = { searchProductCategories?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchProductComponentIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductComponentFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSortInput>> | InputMaybe<SearchableProductComponentSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchProductComponentIdsQuery = { searchProductComponents?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchProductComponentSetIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductComponentSetFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetSortInput>> | InputMaybe<SearchableProductComponentSetSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchProductComponentSetIdsQuery = { searchProductComponentSets?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchAdminUserIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableAdminUserFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableAdminUserSortInput>> | InputMaybe<SearchableAdminUserSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchAdminUserIdsQuery = { searchAdminUsers?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type SearchOrderIdsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableOrderFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableOrderSortInput>> | InputMaybe<SearchableOrderSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
}>;


export type SearchOrderIdsQuery = { searchOrders?: { nextToken?: string | null, items: Array<{ id: string } | null> } | null };

export type CreateUnitMutationVariables = Exact<{
  input: CreateUnitInput;
}>;


export type CreateUnitMutation = { createUnit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type UpdateUnitMutationVariables = Exact<{
  input: UpdateUnitInput;
}>;


export type UpdateUnitMutation = { updateUnit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type UpdateUnitRKeeperDataMutationVariables = Exact<{
  input: UpdateRKeeperDataInput;
}>;


export type UpdateUnitRKeeperDataMutation = { updateUnitRKeeperData?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type CreateAdminUserMutationVariables = Exact<{
  input: CreateAdminUserInput;
}>;


export type CreateAdminUserMutation = { createAdminUser?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type DeleteAdminUserMutationVariables = Exact<{
  input: DeleteAdminUserInput;
}>;


export type DeleteAdminUserMutation = { deleteAdminUser?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type CreateAnonymUserMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAnonymUserMutation = { createAnonymUser?: { username: string, pwd: string } | null };

export type CreateOrderFromCartMutationVariables = Exact<{
  input: CreateOrderFromCartInput;
}>;


export type CreateOrderFromCartMutation = { createOrderFromCart?: string | null };

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { createOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type StartStripePaymentMutationVariables = Exact<{
  input: StartStripePaymentInput;
}>;


export type StartStripePaymentMutation = { startStripePayment?: { clientSecret: string, status: string, paymentMethodId?: string | null, stripeAccount?: string | null } | null };

export type StartStripePaymentConnectedMutationVariables = Exact<{
  input: StartStripePaymentInput;
}>;


export type StartStripePaymentConnectedMutation = { startStripePaymentConnected?: { clientSecret: string, status: string, paymentMethodId?: string | null, stripeAccount?: string | null } | null };

export type PayTipWithStripeMutationVariables = Exact<{
  input: PayTipWithStripeInput;
}>;


export type PayTipWithStripeMutation = { payTipWithStripe?: { clientSecret: string, status: string, paymentMethodId?: string | null, stripeAccount?: string | null } | null };

export type CreateStripeCardMutationVariables = Exact<{
  input: StripeCardCreateInput;
}>;


export type CreateStripeCardMutation = { createStripeCard?: { id: string, name?: string | null, brand?: CardBrand | null, country?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null, fingerprint?: string | null, funding?: CardFundingType | null, three_d_secure?: string | null, createdAt: string, updatedAt: string, checks?: { address_line1_check?: string | null, address_postal_code_check?: string | null, cvc_check?: string | null } | null, billing_details?: { email?: string | null, name?: string | null, phone?: string | null, address?: { city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null };

export type UpdateMyStripeCardMutationVariables = Exact<{
  input: StripeCardUpdateInput;
}>;


export type UpdateMyStripeCardMutation = { updateMyStripeCard?: { id: string, name?: string | null, brand?: CardBrand | null, country?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null, fingerprint?: string | null, funding?: CardFundingType | null, three_d_secure?: string | null, createdAt: string, updatedAt: string, checks?: { address_line1_check?: string | null, address_postal_code_check?: string | null, cvc_check?: string | null } | null, billing_details?: { email?: string | null, name?: string | null, phone?: string | null, address?: { city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null };

export type DeleteMyStripeCardMutationVariables = Exact<{
  input: StripeCardDeleteInput;
}>;


export type DeleteMyStripeCardMutation = { deleteMyStripeCard?: boolean | null };

export type CallWaiterMutationVariables = Exact<{
  input?: InputMaybe<CallWaiterInput>;
}>;


export type CallWaiterMutation = { callWaiter?: boolean | null };

export type CreateUnitProductMutationVariables = Exact<{
  input: CreateUnitProductInput;
  condition?: InputMaybe<ModelUnitProductConditionInput>;
}>;


export type CreateUnitProductMutation = { createUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type UpdateUnitProductMutationVariables = Exact<{
  input: UpdateUnitProductInput;
  condition?: InputMaybe<ModelUnitProductConditionInput>;
}>;


export type UpdateUnitProductMutation = { updateUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type DeleteUnitProductMutationVariables = Exact<{
  input: DeleteUnitProductInput;
  condition?: InputMaybe<ModelUnitProductConditionInput>;
}>;


export type DeleteUnitProductMutation = { deleteUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type CreateVariantMutationVariables = Exact<{
  input: CreateVariantInput;
  condition?: InputMaybe<ModelVariantConditionInput>;
}>;


export type CreateVariantMutation = { createVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type UpdateVariantMutationVariables = Exact<{
  input: UpdateVariantInput;
  condition?: InputMaybe<ModelVariantConditionInput>;
}>;


export type UpdateVariantMutation = { updateVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type DeleteVariantMutationVariables = Exact<{
  input: DeleteVariantInput;
  condition?: InputMaybe<ModelVariantConditionInput>;
}>;


export type DeleteVariantMutation = { deleteVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type UpdateAdminUserMutationVariables = Exact<{
  input: UpdateAdminUserInput;
  condition?: InputMaybe<ModelAdminUserConditionInput>;
}>;


export type UpdateAdminUserMutation = { updateAdminUser?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type UpdateOrderMutationVariables = Exact<{
  input: UpdateOrderInput;
  condition?: InputMaybe<ModelOrderConditionInput>;
}>;


export type UpdateOrderMutation = { updateOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type DeleteOrderMutationVariables = Exact<{
  input: DeleteOrderInput;
  condition?: InputMaybe<ModelOrderConditionInput>;
}>;


export type DeleteOrderMutation = { deleteOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type CreateProductCategoryMutationVariables = Exact<{
  input: CreateProductCategoryInput;
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
}>;


export type CreateProductCategoryMutation = { createProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type UpdateProductCategoryMutationVariables = Exact<{
  input: UpdateProductCategoryInput;
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
}>;


export type UpdateProductCategoryMutation = { updateProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type DeleteProductCategoryMutationVariables = Exact<{
  input: DeleteProductCategoryInput;
  condition?: InputMaybe<ModelProductCategoryConditionInput>;
}>;


export type DeleteProductCategoryMutation = { deleteProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type CreateProductComponentMutationVariables = Exact<{
  input: CreateProductComponentInput;
  condition?: InputMaybe<ModelProductComponentConditionInput>;
}>;


export type CreateProductComponentMutation = { createProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type UpdateProductComponentMutationVariables = Exact<{
  input: UpdateProductComponentInput;
  condition?: InputMaybe<ModelProductComponentConditionInput>;
}>;


export type UpdateProductComponentMutation = { updateProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type DeleteProductComponentMutationVariables = Exact<{
  input: DeleteProductComponentInput;
  condition?: InputMaybe<ModelProductComponentConditionInput>;
}>;


export type DeleteProductComponentMutation = { deleteProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type CreateProductComponentSetMutationVariables = Exact<{
  input: CreateProductComponentSetInput;
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
}>;


export type CreateProductComponentSetMutation = { createProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type UpdateProductComponentSetMutationVariables = Exact<{
  input: UpdateProductComponentSetInput;
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
}>;


export type UpdateProductComponentSetMutation = { updateProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type DeleteProductComponentSetMutationVariables = Exact<{
  input: DeleteProductComponentSetInput;
  condition?: InputMaybe<ModelProductComponentSetConditionInput>;
}>;


export type DeleteProductComponentSetMutation = { deleteProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type CreateFavoriteProductMutationVariables = Exact<{
  input: CreateFavoriteProductInput;
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
}>;


export type CreateFavoriteProductMutation = { createFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type UpdateFavoriteProductMutationVariables = Exact<{
  input: UpdateFavoriteProductInput;
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
}>;


export type UpdateFavoriteProductMutation = { updateFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type DeleteFavoriteProductMutationVariables = Exact<{
  input: DeleteFavoriteProductInput;
  condition?: InputMaybe<ModelFavoriteProductConditionInput>;
}>;


export type DeleteFavoriteProductMutation = { deleteFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type DeleteUnitMutationVariables = Exact<{
  input: DeleteUnitInput;
  condition?: InputMaybe<ModelUnitConditionInput>;
}>;


export type DeleteUnitMutation = { deleteUnit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
  condition?: InputMaybe<ModelUserConditionInput>;
}>;


export type CreateUserMutation = { createUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInput;
  condition?: InputMaybe<ModelUserConditionInput>;
}>;


export type UpdateUserMutation = { updateUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type DeleteUserMutationVariables = Exact<{
  input: DeleteUserInput;
  condition?: InputMaybe<ModelUserConditionInput>;
}>;


export type DeleteUserMutation = { deleteUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type CreateCartMutationVariables = Exact<{
  input: CreateCartInput;
  condition?: InputMaybe<ModelCartConditionInput>;
}>;


export type CreateCartMutation = { createCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type UpdateCartMutationVariables = Exact<{
  input: UpdateCartInput;
  condition?: InputMaybe<ModelCartConditionInput>;
}>;


export type UpdateCartMutation = { updateCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type DeleteCartMutationVariables = Exact<{
  input: DeleteCartInput;
  condition?: InputMaybe<ModelCartConditionInput>;
}>;


export type DeleteCartMutation = { deleteCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type CreateTransactionMutationVariables = Exact<{
  input: CreateTransactionInput;
  condition?: InputMaybe<ModelTransactionConditionInput>;
}>;


export type CreateTransactionMutation = { createTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type UpdateTransactionMutationVariables = Exact<{
  input: UpdateTransactionInput;
  condition?: InputMaybe<ModelTransactionConditionInput>;
}>;


export type UpdateTransactionMutation = { updateTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type DeleteTransactionMutationVariables = Exact<{
  input: DeleteTransactionInput;
  condition?: InputMaybe<ModelTransactionConditionInput>;
}>;


export type DeleteTransactionMutation = { deleteTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type CreateInvoiceMutationVariables = Exact<{
  input: CreateInvoiceInput;
  condition?: InputMaybe<ModelInvoiceConditionInput>;
}>;


export type CreateInvoiceMutation = { createInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type UpdateInvoiceMutationVariables = Exact<{
  input: UpdateInvoiceInput;
  condition?: InputMaybe<ModelInvoiceConditionInput>;
}>;


export type UpdateInvoiceMutation = { updateInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type DeleteInvoiceMutationVariables = Exact<{
  input: DeleteInvoiceInput;
  condition?: InputMaybe<ModelInvoiceConditionInput>;
}>;


export type DeleteInvoiceMutation = { deleteInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type CreateReceiptMutationVariables = Exact<{
  input: CreateReceiptInput;
  condition?: InputMaybe<ModelReceiptConditionInput>;
}>;


export type CreateReceiptMutation = { createReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type UpdateReceiptMutationVariables = Exact<{
  input: UpdateReceiptInput;
  condition?: InputMaybe<ModelReceiptConditionInput>;
}>;


export type UpdateReceiptMutation = { updateReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type DeleteReceiptMutationVariables = Exact<{
  input: DeleteReceiptInput;
  condition?: InputMaybe<ModelReceiptConditionInput>;
}>;


export type DeleteReceiptMutation = { deleteReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type ListStripeCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListStripeCardsQuery = { listStripeCards?: Array<{ id: string, name?: string | null, brand?: CardBrand | null, country?: string | null, last4?: string | null, exp_month?: number | null, exp_year?: number | null, fingerprint?: string | null, funding?: CardFundingType | null, three_d_secure?: string | null, createdAt: string, updatedAt: string, checks?: { address_line1_check?: string | null, address_postal_code_check?: string | null, cvc_check?: string | null } | null, billing_details?: { email?: string | null, name?: string | null, phone?: string | null, address?: { city?: string | null, country?: string | null, line1?: string | null, line2?: string | null, postal_code?: string | null, state?: string | null } | null } | null } | null> | null };

export type GetUnitsNearLocationQueryVariables = Exact<{
  input: GetUnitsNearLocationInput;
}>;


export type GetUnitsNearLocationQuery = { getUnitsNearLocation?: { items?: Array<{ id: string, groupId: string, chainId: string, name: string, distance: number, currency: string, isAcceptingOrders: boolean, openingHours?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, openingHoursNext7: Array<{ date: string, closed: boolean, from?: number | null, to?: number | null }>, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, unit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null } | null> | null } | null };

export type SearchByRadiusQueryVariables = Exact<{
  input: SearchByRadiusInput;
}>;


export type SearchByRadiusQuery = { searchByRadius?: { items?: Array<string | null> | null, nextToken?: string | null, total?: number | null } | null };

export type GetUnitProductQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUnitProductQuery = { getUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type ListUnitProductsQueryVariables = Exact<{
  filter?: InputMaybe<ModelUnitProductFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListUnitProductsQuery = { listUnitProducts?: { nextToken?: string | null, items: Array<{ id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null> } | null };

export type SearchUnitProductsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableUnitProductFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitProductSortInput>> | InputMaybe<SearchableUnitProductSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUnitProductAggregationInput>> | InputMaybe<SearchableUnitProductAggregationInput>>;
}>;


export type SearchUnitProductsQuery = { searchUnitProducts?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetVariantQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetVariantQuery = { getVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type ListVariantsQueryVariables = Exact<{
  filter?: InputMaybe<ModelVariantFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListVariantsQuery = { listVariants?: { nextToken?: string | null, items: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> } | null };

export type SearchVariantsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableVariantFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableVariantSortInput>> | InputMaybe<SearchableVariantSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableVariantAggregationInput>> | InputMaybe<SearchableVariantAggregationInput>>;
}>;


export type SearchVariantsQuery = { searchVariants?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetAdminUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetAdminUserQuery = { getAdminUser?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type ListAdminUsersQueryVariables = Exact<{
  filter?: InputMaybe<ModelAdminUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListAdminUsersQuery = { listAdminUsers?: { nextToken?: string | null, items: Array<{ id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null> } | null };

export type SearchAdminUsersQueryVariables = Exact<{
  filter?: InputMaybe<SearchableAdminUserFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableAdminUserSortInput>> | InputMaybe<SearchableAdminUserSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableAdminUserAggregationInput>> | InputMaybe<SearchableAdminUserAggregationInput>>;
}>;


export type SearchAdminUsersQuery = { searchAdminUsers?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetOrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetOrderQuery = { getOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type ListOrdersQueryVariables = Exact<{
  filter?: InputMaybe<ModelOrderFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListOrdersQuery = { listOrders?: { nextToken?: string | null, items: Array<{ id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null> } | null };

export type SearchOrdersQueryVariables = Exact<{
  filter?: InputMaybe<SearchableOrderFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableOrderSortInput>> | InputMaybe<SearchableOrderSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableOrderAggregationInput>> | InputMaybe<SearchableOrderAggregationInput>>;
}>;


export type SearchOrdersQuery = { searchOrders?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetProductCategoryQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductCategoryQuery = { getProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type ListProductCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<ModelProductCategoryFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListProductCategoriesQuery = { listProductCategories?: { nextToken?: string | null, items: Array<{ id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null> } | null };

export type SearchProductCategoriesQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductCategoryFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductCategorySortInput>> | InputMaybe<SearchableProductCategorySortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductCategoryAggregationInput>> | InputMaybe<SearchableProductCategoryAggregationInput>>;
}>;


export type SearchProductCategoriesQuery = { searchProductCategories?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetProductComponentQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductComponentQuery = { getProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type ListProductComponentsQueryVariables = Exact<{
  filter?: InputMaybe<ModelProductComponentFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListProductComponentsQuery = { listProductComponents?: { nextToken?: string | null, items: Array<{ id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null> } | null };

export type SearchProductComponentsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductComponentFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSortInput>> | InputMaybe<SearchableProductComponentSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductComponentAggregationInput>> | InputMaybe<SearchableProductComponentAggregationInput>>;
}>;


export type SearchProductComponentsQuery = { searchProductComponents?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetProductComponentSetQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetProductComponentSetQuery = { getProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type ListProductComponentSetsQueryVariables = Exact<{
  filter?: InputMaybe<ModelProductComponentSetFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListProductComponentSetsQuery = { listProductComponentSets?: { nextToken?: string | null, items: Array<{ id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null> } | null };

export type SearchProductComponentSetsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableProductComponentSetFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetSortInput>> | InputMaybe<SearchableProductComponentSetSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableProductComponentSetAggregationInput>> | InputMaybe<SearchableProductComponentSetAggregationInput>>;
}>;


export type SearchProductComponentSetsQuery = { searchProductComponentSets?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetFavoriteProductQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetFavoriteProductQuery = { getFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type ListFavoriteProductsQueryVariables = Exact<{
  filter?: InputMaybe<ModelFavoriteProductFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListFavoriteProductsQuery = { listFavoriteProducts?: { nextToken?: string | null, items: Array<{ id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null> } | null };

export type SearchFavoriteProductsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableFavoriteProductFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductSortInput>> | InputMaybe<SearchableFavoriteProductSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableFavoriteProductAggregationInput>> | InputMaybe<SearchableFavoriteProductAggregationInput>>;
}>;


export type SearchFavoriteProductsQuery = { searchFavoriteProducts?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetUnitQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUnitQuery = { getUnit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type ListUnitsQueryVariables = Exact<{
  filter?: InputMaybe<ModelUnitFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListUnitsQuery = { listUnits?: { nextToken?: string | null, items: Array<{ id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null> } | null };

export type SearchUnitsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableUnitFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUnitSortInput>> | InputMaybe<SearchableUnitSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUnitAggregationInput>> | InputMaybe<SearchableUnitAggregationInput>>;
}>;


export type SearchUnitsQuery = { searchUnits?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetUserQuery = { getUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type ListUsersQueryVariables = Exact<{
  filter?: InputMaybe<ModelUserFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListUsersQuery = { listUsers?: { nextToken?: string | null, items: Array<{ id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null> } | null };

export type SearchUsersQueryVariables = Exact<{
  filter?: InputMaybe<SearchableUserFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableUserSortInput>> | InputMaybe<SearchableUserSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableUserAggregationInput>> | InputMaybe<SearchableUserAggregationInput>>;
}>;


export type SearchUsersQuery = { searchUsers?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetCartQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetCartQuery = { getCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type ListCartsQueryVariables = Exact<{
  filter?: InputMaybe<ModelCartFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListCartsQuery = { listCarts?: { nextToken?: string | null, items: Array<{ id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null> } | null };

export type SearchCartsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableCartFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableCartSortInput>> | InputMaybe<SearchableCartSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableCartAggregationInput>> | InputMaybe<SearchableCartAggregationInput>>;
}>;


export type SearchCartsQuery = { searchCarts?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetTransactionQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetTransactionQuery = { getTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type ListTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<ModelTransactionFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListTransactionsQuery = { listTransactions?: { nextToken?: string | null, items: Array<{ id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null> } | null };

export type SearchTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableTransactionFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableTransactionSortInput>> | InputMaybe<SearchableTransactionSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableTransactionAggregationInput>> | InputMaybe<SearchableTransactionAggregationInput>>;
}>;


export type SearchTransactionsQuery = { searchTransactions?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetInvoiceQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetInvoiceQuery = { getInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type ListInvoicesQueryVariables = Exact<{
  filter?: InputMaybe<ModelInvoiceFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListInvoicesQuery = { listInvoices?: { nextToken?: string | null, items: Array<{ id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null> } | null };

export type SearchInvoicesQueryVariables = Exact<{
  filter?: InputMaybe<SearchableInvoiceFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableInvoiceSortInput>> | InputMaybe<SearchableInvoiceSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableInvoiceAggregationInput>> | InputMaybe<SearchableInvoiceAggregationInput>>;
}>;


export type SearchInvoicesQuery = { searchInvoices?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type GetReceiptQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type GetReceiptQuery = { getReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type ListReceiptsQueryVariables = Exact<{
  filter?: InputMaybe<ModelReceiptFilterInput>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
}>;


export type ListReceiptsQuery = { listReceipts?: { nextToken?: string | null, items: Array<{ id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null> } | null };

export type SearchReceiptsQueryVariables = Exact<{
  filter?: InputMaybe<SearchableReceiptFilterInput>;
  sort?: InputMaybe<Array<InputMaybe<SearchableReceiptSortInput>> | InputMaybe<SearchableReceiptSortInput>>;
  limit?: InputMaybe<Scalars['Int']>;
  nextToken?: InputMaybe<Scalars['String']>;
  from?: InputMaybe<Scalars['Int']>;
  aggregates?: InputMaybe<Array<InputMaybe<SearchableReceiptAggregationInput>> | InputMaybe<SearchableReceiptAggregationInput>>;
}>;


export type SearchReceiptsQuery = { searchReceipts?: { nextToken?: string | null, total?: number | null, items: Array<{ id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null>, aggregateItems: Array<{ name: string, result?: { buckets?: Array<{ key: string, doc_count: number } | null> | null } | { value: number } | null } | null> } | null };

export type OnAdminUserChangeSubscriptionVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OnAdminUserChangeSubscription = { onAdminUserChange?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type OnAdminUsersChangeSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnAdminUsersChangeSubscription = { onAdminUsersChange?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type OnProductCategoriesChangeSubscriptionVariables = Exact<{
  unitId: Scalars['ID'];
}>;


export type OnProductCategoriesChangeSubscription = { onProductCategoriesChange?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnProductComponentsChangeSubscriptionVariables = Exact<{
  unitId: Scalars['ID'];
}>;


export type OnProductComponentsChangeSubscription = { onProductComponentsChange?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnProductComponentSetsChangeSubscriptionVariables = Exact<{
  unitId: Scalars['ID'];
}>;


export type OnProductComponentSetsChangeSubscription = { onProductComponentSetsChange?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnUnitProductChangeSubscriptionVariables = Exact<{
  unitId: Scalars['ID'];
}>;


export type OnUnitProductChangeSubscription = { onUnitProductChange?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type OnOrdersChangeSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnOrdersChangeSubscription = { onOrdersChange?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnOrdersDeleteSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnOrdersDeleteSubscription = { onOrdersDelete?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnOrderChangedSubscriptionVariables = Exact<{
  userId?: InputMaybe<Scalars['String']>;
  unitId?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
}>;


export type OnOrderChangedSubscription = { onOrderChanged?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnUnitOrdersChangeSubscriptionVariables = Exact<{
  unitId?: InputMaybe<Scalars['String']>;
  archived?: InputMaybe<Scalars['Boolean']>;
}>;


export type OnUnitOrdersChangeSubscription = { onUnitOrdersChange?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnCreateUnitProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateUnitProductSubscription = { onCreateUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type OnUpdateUnitProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateUnitProductSubscription = { onUpdateUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type OnDeleteUnitProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteUnitProductSubscription = { onDeleteUnitProduct?: { id: string, unitId: string, isVisible: boolean, takeaway?: boolean | null, laneId?: string | null, position: number, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, tax: number, takeawayTax?: number | null, productCategoryId: string, productType: ProductType, image?: string | null, allergens?: Array<Allergen | null> | null, createdAt: string, updatedAt: string, variants?: Array<{ id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct?: string | null, externalId?: string | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null> | null, configSets?: Array<{ productSetId: string, position: number, items: Array<{ productComponentId: string, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null }> } | null> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null };

export type OnCreateVariantSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateVariantSubscription = { onCreateVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type OnUpdateVariantSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateVariantSubscription = { onUpdateVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type OnDeleteVariantSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteVariantSubscription = { onDeleteVariant?: { id: string, isAvailable: boolean, price: number, position: number, netPackagingFee?: number | null, soldOut?: boolean | null, ownerProduct: string, externalId?: string | null, createdAt: string, updatedAt: string, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null, availabilities?: Array<{ type: string, dayFrom?: string | null, dayTo?: string | null, timeFrom?: string | null, timeTo?: string | null, price: number } | null> | null } | null };

export type OnUpdateAdminUserSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateAdminUserSubscription = { onUpdateAdminUser?: { id: string, name: string, email: string, phone: string, profileImage?: string | null, createdAt: string, updatedAt: string, settings?: { selectedUnitId?: string | null, selectedProductCategoryId?: string | null, selectedLanguage?: string | null, selectedHistoryDate?: number | null } | null } | null };

export type OnUpdateOrderSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateOrderSubscription = { onUpdateOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnDeleteOrderSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteOrderSubscription = { onDeleteOrder?: { id: string, version?: number | null, userId: string, unitId: string, orderNum?: string | null, archived: boolean, paymentIntention?: number | null, transactionStatus?: PaymentStatus | null, transactionId?: string | null, unpayCategory?: UnpayCategory | null, orderMode?: OrderMode | null, servingMode?: ServingMode | null, hasRated?: boolean | null, tipTransactionStatus?: PaymentStatus | null, tipTransactionId?: string | null, orderPolicy?: OrderPolicy | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, packagingFeeTaxPercentage?: number | null, externalId?: string | null, guestLabel?: string | null, currentStatus?: OrderStatus | null, createdAt: string, updatedAt: string, visitId?: string | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }>, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, place?: { seat: string, table: string } | null, transaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFee?: { currency?: string | null, grossPrice?: number | null, taxContent?: number | null } | null, packagingSum?: { currency: string, netPrice: number, taxPercentage: number } | null, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, rating?: { key: string, value: number } | null, tip?: { type: TipType, value: number } | null, tipTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null } | null };

export type OnCreateProductCategorySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateProductCategorySubscription = { onCreateProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnUpdateProductCategorySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateProductCategorySubscription = { onUpdateProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnDeleteProductCategorySubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteProductCategorySubscription = { onDeleteProductCategory?: { id: string, ownerEntity: string, parentId?: string | null, image?: string | null, position: number, createdAt: string, updatedAt: string, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnCreateProductComponentSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateProductComponentSubscription = { onCreateProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnUpdateProductComponentSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateProductComponentSubscription = { onUpdateProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnDeleteProductComponentSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteProductComponentSubscription = { onDeleteProductComponent?: { id: string, ownerEntity: string, description?: string | null, allergens?: Array<Allergen | null> | null, externalId?: string | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnCreateProductComponentSetSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateProductComponentSetSubscription = { onCreateProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnUpdateProductComponentSetSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateProductComponentSetSubscription = { onUpdateProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnDeleteProductComponentSetSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteProductComponentSetSubscription = { onDeleteProductComponentSet?: { id: string, externalId?: string | null, ownerEntity: string, type: ProductComponentSetType, description: string, items: Array<string>, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, dirty?: boolean | null, deletedAt?: string | null, createdAt: string, updatedAt: string, name: { en?: string | null, de?: string | null, hu?: string | null } } | null };

export type OnCreateFavoriteProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateFavoriteProductSubscription = { onCreateFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type OnUpdateFavoriteProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateFavoriteProductSubscription = { onUpdateFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type OnDeleteFavoriteProductSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteFavoriteProductSubscription = { onDeleteFavoriteProduct?: { id: string, userId: string, unitId: string, createdAt: string, updatedAt: string, product: { id: string, unitId: string, productCategoryId: string, productType: ProductType, tax: number, takeawayTax?: number | null, position: number, image?: string | null, allergens?: Array<Allergen | null> | null, supportedServingModes?: Array<ServingMode> | null, soldOut?: boolean | null, name: { en?: string | null, de?: string | null, hu?: string | null }, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, variants: Array<{ id: string, price: number, netPackagingFee?: number | null, position: number, soldOut?: boolean | null, variantName: { en?: string | null, de?: string | null, hu?: string | null }, pack?: { size: number, unit: string } | null }>, configSets?: Array<{ productSetId: string, position: number, type: ProductComponentSetType, maxSelection?: number | null, supportedServingModes?: Array<ServingMode> | null, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, position: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, soldOut?: boolean | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> } | null> | null } } | null };

export type OnDeleteUnitSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteUnitSubscription = { onDeleteUnit?: { id: string, adBannersEnabled?: boolean | null, lastOrderNum?: number | null, isActive: boolean, isAcceptingOrders: boolean, name: string, email?: string | null, phone?: string | null, merchantId?: string | null, timeZone?: string | null, externalId?: string | null, supportedServingModes?: Array<ServingMode> | null, supportedOrderModes?: Array<OrderMode> | null, orderPolicy?: OrderPolicy | null, packagingTaxPercentage?: number | null, soldOutVisibilityPolicy?: SoldOutVisibilityPolicy | null, orderPaymentPolicy?: OrderPaymentPolicy | null, canRequestVatInvoice?: boolean | null, canCallWaiter?: boolean | null, isVisibleInApp?: boolean | null, currency: string, createdAt: string, updatedAt: string, adBanners?: Array<{ imageUrl: string }> | null, coverBanners?: Array<{ imageUrl: string }> | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null, address: { address: string, city: string, country: string, title: string, postalCode: string, location?: { lat: number, lng: number } | null }, paymentModes?: Array<{ type: PaymentType, caption?: string | null, method: PaymentMethod } | null> | null, floorMap?: { w: number, h: number, objects?: Array<{ id: string, t: UnitMapObjectType, c?: string | null, w?: number | null, h?: number | null, r?: number | null, a?: number | null, x: number, y: number, tID?: string | null, sID?: string | null }> | null } | null, lanes?: Array<{ id: string, name: string, color: string } | null> | null, open?: { from?: string | null, to?: string | null } | null, openingHours?: { mon?: { from: string, to: string } | null, tue?: { from: string, to: string } | null, wed?: { from: string, to: string } | null, thu?: { from: string, to: string } | null, fri?: { from: string, to: string } | null, sat?: { from: string, to: string } | null, sun?: { from: string, to: string } | null, custom?: Array<{ date: string, from: string, to: string } | null> | null } | null, pos?: { type: PosType, rkeeper?: { endpointUri: string, rkeeperUsername: string, rkeeperPassword: string, anyuppUsername: string, anyuppPassword: string, waiterOrderId?: string | null } | null } | null, serviceFeePolicy?: { type: ServiceFeeType, percentage: number } | null, ratingPolicies?: Array<{ key: string, title: { en?: string | null, de?: string | null, hu?: string | null }, description: { en?: string | null, de?: string | null, hu?: string | null }, ratings: Array<{ value: number, icon?: string | null, text: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, tipPolicy?: { percents: Array<number>, minOtherAmount?: number | null, title?: { en?: string | null, de?: string | null, hu?: string | null } | null, description?: { en?: string | null, de?: string | null, hu?: string | null } | null } | null, location: { lat: number, lon: number }, style: { colors: { backgroundLight?: string | null, backgroundDark?: string | null, borderLight?: string | null, borderDark?: string | null, disabled?: string | null, indicator?: string | null, textLight?: string | null, textDark?: string | null, primary?: string | null, secondary?: string | null, button?: string | null, buttonText?: string | null, icon?: string | null, highlight?: string | null }, images?: { header?: string | null, logo?: string | null } | null }, categoryOrders?: Array<{ id: string, parentId?: string | null } | null> | null } | null };

export type OnCreateUserSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateUserSubscription = { onCreateUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type OnUpdateUserSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateUserSubscription = { onUpdateUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type OnDeleteUserSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteUserSubscription = { onDeleteUser?: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null } | null };

export type OnCreateCartSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateCartSubscription = { onCreateCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type OnUpdateCartSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateCartSubscription = { onUpdateCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type OnDeleteCartSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteCartSubscription = { onDeleteCart?: { id: string, version?: number | null, userId: string, unitId: string, takeAway?: boolean | null, servingMode?: ServingMode | null, orderMode?: OrderMode | null, orderPolicy?: OrderPolicy | null, guestLabel?: string | null, createdAt: string, updatedAt: string, place?: { seat: string, table: string } | null, paymentMode?: { type: PaymentType, caption?: string | null, method: PaymentMethod } | null, items: Array<{ productId: string, variantId: string, created?: number | null, image?: string | null, quantity: number, laneId?: string | null, allergens?: Array<Allergen | null> | null, productType?: ProductType | null, externalId?: string | null, netPackagingFee?: number | null, productName: { en?: string | null, de?: string | null, hu?: string | null }, statusLog: Array<{ userId: string, status: OrderStatus, ts: number }>, variantName: { en?: string | null, de?: string | null, hu?: string | null }, configSets?: Array<{ productSetId: string, type: ProductComponentSetType, name: { en?: string | null, de?: string | null, hu?: string | null }, items: Array<{ productComponentId: string, price: number, allergens?: Array<Allergen | null> | null, netPackagingFee?: number | null, externalId?: string | null, name: { en?: string | null, de?: string | null, hu?: string | null } }> }> | null, serviceFee?: { currency: string, netPrice: number, taxPercentage: number } | null, priceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number }, sumPriceShown: { currency: string, pricePerUnit: number, priceSum: number, tax: number, taxSum: number } }> } | null };

export type OnCreateTransactionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateTransactionSubscription = { onCreateTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type OnUpdateTransactionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateTransactionSubscription = { onUpdateTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type OnDeleteTransactionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteTransactionSubscription = { onDeleteTransaction?: { id: string, userId: string, orderId: string, type?: string | null, total?: number | null, currency?: string | null, status?: PaymentStatus | null, externalTransactionId?: string | null, invoiceId?: string | null, receiptId?: string | null, createdAt: string, updatedAt: string, paymentMethodId?: string | null, user: { id: string, name?: string | null, email?: string | null, phone?: string | null, profileImage?: string | null, stripeCustomerId?: string | null, createdAt: string, updatedAt: string, invoiceAddress?: { customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null } | null, fcmTokens?: Array<{ token: string, lastSeen: string }> | null }, invoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null, receipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null } | null };

export type OnCreateInvoiceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateInvoiceSubscription = { onCreateInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type OnUpdateInvoiceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateInvoiceSubscription = { onUpdateInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type OnDeleteInvoiceSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteInvoiceSubscription = { onDeleteInvoice?: { id: string, userId: string, orderId: string, transactionId: string, externalInvoiceId?: string | null, customerName: string, taxNumber: string, country: string, city: string, streetAddress: string, postalCode: string, email?: string | null, pdfUrl?: string | null, status: InvoiceStatus, createdAt: string, updatedAt: string } | null };

export type OnCreateReceiptSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnCreateReceiptSubscription = { onCreateReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type OnUpdateReceiptSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnUpdateReceiptSubscription = { onUpdateReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };

export type OnDeleteReceiptSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnDeleteReceiptSubscription = { onDeleteReceipt?: { id: string, userId: string, orderId: string, transactionId: string, externalReceiptId?: string | null, email?: string | null, pdfData?: string | null, status: ReceiptStatus, createdAt: string, updatedAt: string } | null };


export const SearchReportOrdersDocument = gql`
    query SearchReportOrders($filter: SearchableOrderFilterInput, $sort: [SearchableOrderSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchOrders(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      createdAt
      userId
      sumPriceShown {
        currency
        priceSum
      }
    }
    nextToken
  }
}
    `;
export const SearchUnitIdsDocument = gql`
    query SearchUnitIds($filter: SearchableUnitFilterInput, $sort: [SearchableUnitSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchUnits(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchUnitProductIdsDocument = gql`
    query SearchUnitProductIds($filter: SearchableUnitProductFilterInput, $sort: [SearchableUnitProductSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchUnitProducts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchProductCategoryIdsDocument = gql`
    query SearchProductCategoryIds($filter: SearchableProductCategoryFilterInput, $sort: [SearchableProductCategorySortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchProductCategories(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchProductComponentIdsDocument = gql`
    query SearchProductComponentIds($filter: SearchableProductComponentFilterInput, $sort: [SearchableProductComponentSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchProductComponents(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchProductComponentSetIdsDocument = gql`
    query SearchProductComponentSetIds($filter: SearchableProductComponentSetFilterInput, $sort: [SearchableProductComponentSetSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchProductComponentSets(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchAdminUserIdsDocument = gql`
    query SearchAdminUserIds($filter: SearchableAdminUserFilterInput, $sort: [SearchableAdminUserSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchAdminUsers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const SearchOrderIdsDocument = gql`
    query SearchOrderIds($filter: SearchableOrderFilterInput, $sort: [SearchableOrderSortInput], $limit: Int, $nextToken: String, $from: Int) {
  searchOrders(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
  ) {
    items {
      id
    }
    nextToken
  }
}
    `;
export const CreateUnitDocument = gql`
    mutation CreateUnit($input: CreateUnitInput!) {
  createUnit(input: $input) {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateUnitDocument = gql`
    mutation UpdateUnit($input: UpdateUnitInput!) {
  updateUnit(input: $input) {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateUnitRKeeperDataDocument = gql`
    mutation UpdateUnitRKeeperData($input: UpdateRKeeperDataInput!) {
  updateUnitRKeeperData(input: $input) {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateAdminUserDocument = gql`
    mutation CreateAdminUser($input: CreateAdminUserInput!) {
  createAdminUser(input: $input) {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const DeleteAdminUserDocument = gql`
    mutation DeleteAdminUser($input: DeleteAdminUserInput!) {
  deleteAdminUser(input: $input) {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateAnonymUserDocument = gql`
    mutation CreateAnonymUser {
  createAnonymUser {
    username
    pwd
  }
}
    `;
export const CreateOrderFromCartDocument = gql`
    mutation CreateOrderFromCart($input: CreateOrderFromCartInput!) {
  createOrderFromCart(input: $input)
}
    `;
export const CreateOrderDocument = gql`
    mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const StartStripePaymentDocument = gql`
    mutation StartStripePayment($input: StartStripePaymentInput!) {
  startStripePayment(input: $input) {
    clientSecret
    status
    paymentMethodId
    stripeAccount
  }
}
    `;
export const StartStripePaymentConnectedDocument = gql`
    mutation StartStripePaymentConnected($input: StartStripePaymentInput!) {
  startStripePaymentConnected(input: $input) {
    clientSecret
    status
    paymentMethodId
    stripeAccount
  }
}
    `;
export const PayTipWithStripeDocument = gql`
    mutation PayTipWithStripe($input: PayTipWithStripeInput!) {
  payTipWithStripe(input: $input) {
    clientSecret
    status
    paymentMethodId
    stripeAccount
  }
}
    `;
export const CreateStripeCardDocument = gql`
    mutation CreateStripeCard($input: StripeCardCreateInput!) {
  createStripeCard(input: $input) {
    id
    name
    brand
    checks {
      address_line1_check
      address_postal_code_check
      cvc_check
    }
    country
    last4
    exp_month
    exp_year
    fingerprint
    funding
    three_d_secure
    billing_details {
      email
      name
      phone
      address {
        city
        country
        line1
        line2
        postal_code
        state
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateMyStripeCardDocument = gql`
    mutation UpdateMyStripeCard($input: StripeCardUpdateInput!) {
  updateMyStripeCard(input: $input) {
    id
    name
    brand
    checks {
      address_line1_check
      address_postal_code_check
      cvc_check
    }
    country
    last4
    exp_month
    exp_year
    fingerprint
    funding
    three_d_secure
    billing_details {
      email
      name
      phone
      address {
        city
        country
        line1
        line2
        postal_code
        state
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const DeleteMyStripeCardDocument = gql`
    mutation DeleteMyStripeCard($input: StripeCardDeleteInput!) {
  deleteMyStripeCard(input: $input)
}
    `;
export const CallWaiterDocument = gql`
    mutation CallWaiter($input: CallWaiterInput) {
  callWaiter(input: $input)
}
    `;
export const CreateUnitProductDocument = gql`
    mutation CreateUnitProduct($input: CreateUnitProductInput!, $condition: ModelUnitProductConditionInput) {
  createUnitProduct(input: $input, condition: $condition) {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const UpdateUnitProductDocument = gql`
    mutation UpdateUnitProduct($input: UpdateUnitProductInput!, $condition: ModelUnitProductConditionInput) {
  updateUnitProduct(input: $input, condition: $condition) {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const DeleteUnitProductDocument = gql`
    mutation DeleteUnitProduct($input: DeleteUnitProductInput!, $condition: ModelUnitProductConditionInput) {
  deleteUnitProduct(input: $input, condition: $condition) {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const CreateVariantDocument = gql`
    mutation CreateVariant($input: CreateVariantInput!, $condition: ModelVariantConditionInput) {
  createVariant(input: $input, condition: $condition) {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const UpdateVariantDocument = gql`
    mutation UpdateVariant($input: UpdateVariantInput!, $condition: ModelVariantConditionInput) {
  updateVariant(input: $input, condition: $condition) {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const DeleteVariantDocument = gql`
    mutation DeleteVariant($input: DeleteVariantInput!, $condition: ModelVariantConditionInput) {
  deleteVariant(input: $input, condition: $condition) {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const UpdateAdminUserDocument = gql`
    mutation UpdateAdminUser($input: UpdateAdminUserInput!, $condition: ModelAdminUserConditionInput) {
  updateAdminUser(input: $input, condition: $condition) {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateOrderDocument = gql`
    mutation UpdateOrder($input: UpdateOrderInput!, $condition: ModelOrderConditionInput) {
  updateOrder(input: $input, condition: $condition) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const DeleteOrderDocument = gql`
    mutation DeleteOrder($input: DeleteOrderInput!, $condition: ModelOrderConditionInput) {
  deleteOrder(input: $input, condition: $condition) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const CreateProductCategoryDocument = gql`
    mutation CreateProductCategory($input: CreateProductCategoryInput!, $condition: ModelProductCategoryConditionInput) {
  createProductCategory(input: $input, condition: $condition) {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const UpdateProductCategoryDocument = gql`
    mutation UpdateProductCategory($input: UpdateProductCategoryInput!, $condition: ModelProductCategoryConditionInput) {
  updateProductCategory(input: $input, condition: $condition) {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const DeleteProductCategoryDocument = gql`
    mutation DeleteProductCategory($input: DeleteProductCategoryInput!, $condition: ModelProductCategoryConditionInput) {
  deleteProductCategory(input: $input, condition: $condition) {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const CreateProductComponentDocument = gql`
    mutation CreateProductComponent($input: CreateProductComponentInput!, $condition: ModelProductComponentConditionInput) {
  createProductComponent(input: $input, condition: $condition) {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const UpdateProductComponentDocument = gql`
    mutation UpdateProductComponent($input: UpdateProductComponentInput!, $condition: ModelProductComponentConditionInput) {
  updateProductComponent(input: $input, condition: $condition) {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const DeleteProductComponentDocument = gql`
    mutation DeleteProductComponent($input: DeleteProductComponentInput!, $condition: ModelProductComponentConditionInput) {
  deleteProductComponent(input: $input, condition: $condition) {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const CreateProductComponentSetDocument = gql`
    mutation CreateProductComponentSet($input: CreateProductComponentSetInput!, $condition: ModelProductComponentSetConditionInput) {
  createProductComponentSet(input: $input, condition: $condition) {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const UpdateProductComponentSetDocument = gql`
    mutation UpdateProductComponentSet($input: UpdateProductComponentSetInput!, $condition: ModelProductComponentSetConditionInput) {
  updateProductComponentSet(input: $input, condition: $condition) {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const DeleteProductComponentSetDocument = gql`
    mutation DeleteProductComponentSet($input: DeleteProductComponentSetInput!, $condition: ModelProductComponentSetConditionInput) {
  deleteProductComponentSet(input: $input, condition: $condition) {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const CreateFavoriteProductDocument = gql`
    mutation CreateFavoriteProduct($input: CreateFavoriteProductInput!, $condition: ModelFavoriteProductConditionInput) {
  createFavoriteProduct(input: $input, condition: $condition) {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateFavoriteProductDocument = gql`
    mutation UpdateFavoriteProduct($input: UpdateFavoriteProductInput!, $condition: ModelFavoriteProductConditionInput) {
  updateFavoriteProduct(input: $input, condition: $condition) {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const DeleteFavoriteProductDocument = gql`
    mutation DeleteFavoriteProduct($input: DeleteFavoriteProductInput!, $condition: ModelFavoriteProductConditionInput) {
  deleteFavoriteProduct(input: $input, condition: $condition) {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const DeleteUnitDocument = gql`
    mutation DeleteUnit($input: DeleteUnitInput!, $condition: ModelUnitConditionInput) {
  deleteUnit(input: $input, condition: $condition) {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateUserDocument = gql`
    mutation CreateUser($input: CreateUserInput!, $condition: ModelUserConditionInput) {
  createUser(input: $input, condition: $condition) {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const UpdateUserDocument = gql`
    mutation UpdateUser($input: UpdateUserInput!, $condition: ModelUserConditionInput) {
  updateUser(input: $input, condition: $condition) {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const DeleteUserDocument = gql`
    mutation DeleteUser($input: DeleteUserInput!, $condition: ModelUserConditionInput) {
  deleteUser(input: $input, condition: $condition) {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const CreateCartDocument = gql`
    mutation CreateCart($input: CreateCartInput!, $condition: ModelCartConditionInput) {
  createCart(input: $input, condition: $condition) {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const UpdateCartDocument = gql`
    mutation UpdateCart($input: UpdateCartInput!, $condition: ModelCartConditionInput) {
  updateCart(input: $input, condition: $condition) {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const DeleteCartDocument = gql`
    mutation DeleteCart($input: DeleteCartInput!, $condition: ModelCartConditionInput) {
  deleteCart(input: $input, condition: $condition) {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const CreateTransactionDocument = gql`
    mutation CreateTransaction($input: CreateTransactionInput!, $condition: ModelTransactionConditionInput) {
  createTransaction(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const UpdateTransactionDocument = gql`
    mutation UpdateTransaction($input: UpdateTransactionInput!, $condition: ModelTransactionConditionInput) {
  updateTransaction(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const DeleteTransactionDocument = gql`
    mutation DeleteTransaction($input: DeleteTransactionInput!, $condition: ModelTransactionConditionInput) {
  deleteTransaction(input: $input, condition: $condition) {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const CreateInvoiceDocument = gql`
    mutation CreateInvoice($input: CreateInvoiceInput!, $condition: ModelInvoiceConditionInput) {
  createInvoice(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const UpdateInvoiceDocument = gql`
    mutation UpdateInvoice($input: UpdateInvoiceInput!, $condition: ModelInvoiceConditionInput) {
  updateInvoice(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const DeleteInvoiceDocument = gql`
    mutation DeleteInvoice($input: DeleteInvoiceInput!, $condition: ModelInvoiceConditionInput) {
  deleteInvoice(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const CreateReceiptDocument = gql`
    mutation CreateReceipt($input: CreateReceiptInput!, $condition: ModelReceiptConditionInput) {
  createReceipt(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const UpdateReceiptDocument = gql`
    mutation UpdateReceipt($input: UpdateReceiptInput!, $condition: ModelReceiptConditionInput) {
  updateReceipt(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const DeleteReceiptDocument = gql`
    mutation DeleteReceipt($input: DeleteReceiptInput!, $condition: ModelReceiptConditionInput) {
  deleteReceipt(input: $input, condition: $condition) {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListStripeCardsDocument = gql`
    query ListStripeCards {
  listStripeCards {
    id
    name
    brand
    checks {
      address_line1_check
      address_postal_code_check
      cvc_check
    }
    country
    last4
    exp_month
    exp_year
    fingerprint
    funding
    three_d_secure
    billing_details {
      email
      name
      phone
      address {
        city
        country
        line1
        line2
        postal_code
        state
      }
    }
    createdAt
    updatedAt
  }
}
    `;
export const GetUnitsNearLocationDocument = gql`
    query GetUnitsNearLocation($input: GetUnitsNearLocationInput!) {
  getUnitsNearLocation(input: $input) {
    items {
      id
      groupId
      chainId
      name
      address {
        address
        city
        country
        title
        postalCode
        location {
          lat
          lng
        }
      }
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
        }
        images {
          header
          logo
        }
      }
      paymentModes {
        type
        caption
        method
      }
      distance
      currency
      isAcceptingOrders
      openingHours
      openingHoursNext7 {
        date
        closed
        from
        to
      }
      supportedServingModes
      supportedOrderModes
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      unit {
        id
        adBanners {
          imageUrl
        }
        adBannersEnabled
        coverBanners {
          imageUrl
        }
        lastOrderNum
        isActive
        isAcceptingOrders
        name
        description {
          en
          de
          hu
        }
        address {
          address
          city
          country
          title
          postalCode
          location {
            lat
            lng
          }
        }
        email
        phone
        paymentModes {
          type
          caption
          method
        }
        floorMap {
          w
          h
          objects {
            id
            t
            c
            w
            h
            r
            a
            x
            y
            tID
            sID
          }
        }
        lanes {
          id
          name
          color
        }
        open {
          from
          to
        }
        openingHours {
          mon {
            from
            to
          }
          tue {
            from
            to
          }
          wed {
            from
            to
          }
          thu {
            from
            to
          }
          fri {
            from
            to
          }
          sat {
            from
            to
          }
          sun {
            from
            to
          }
          custom {
            date
            from
            to
          }
        }
        merchantId
        timeZone
        pos {
          type
          rkeeper {
            endpointUri
            rkeeperUsername
            rkeeperPassword
            anyuppUsername
            anyuppPassword
            waiterOrderId
          }
        }
        externalId
        supportedServingModes
        supportedOrderModes
        orderPolicy
        packagingTaxPercentage
        serviceFeePolicy {
          type
          percentage
        }
        ratingPolicies {
          key
          title {
            en
            de
            hu
          }
          description {
            en
            de
            hu
          }
          ratings {
            value
            text {
              en
              de
              hu
            }
            icon
          }
        }
        tipPolicy {
          title {
            en
            de
            hu
          }
          description {
            en
            de
            hu
          }
          percents
          minOtherAmount
        }
        soldOutVisibilityPolicy
        orderPaymentPolicy
        location {
          lat
          lon
        }
        canRequestVatInvoice
        canCallWaiter
        isVisibleInApp
        currency
        style {
          colors {
            backgroundLight
            backgroundDark
            borderLight
            borderDark
            disabled
            indicator
            textLight
            textDark
            primary
            secondary
            button
            buttonText
            icon
            highlight
          }
          images {
            header
            logo
          }
        }
        categoryOrders {
          id
          parentId
        }
        createdAt
        updatedAt
      }
    }
  }
}
    `;
export const SearchByRadiusDocument = gql`
    query SearchByRadius($input: SearchByRadiusInput!) {
  searchByRadius(input: $input) {
    items
    nextToken
    total
  }
}
    `;
export const GetUnitProductDocument = gql`
    query GetUnitProduct($id: ID!) {
  getUnitProduct(id: $id) {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const ListUnitProductsDocument = gql`
    query ListUnitProducts($filter: ModelUnitProductFilterInput, $limit: Int, $nextToken: String) {
  listUnitProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      unitId
      isVisible
      takeaway
      laneId
      position
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        isAvailable
        price
        availabilities {
          type
          dayFrom
          dayTo
          timeFrom
          timeTo
          price
        }
        position
        netPackagingFee
        soldOut
        ownerProduct
        externalId
      }
      configSets {
        productSetId
        items {
          productComponentId
          price
          position
          netPackagingFee
          soldOut
        }
        position
      }
      supportedServingModes
      dirty
      deletedAt
      tax
      takeawayTax
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productCategoryId
      productType
      image
      allergens
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchUnitProductsDocument = gql`
    query SearchUnitProducts($filter: SearchableUnitProductFilterInput, $sort: [SearchableUnitProductSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableUnitProductAggregationInput]) {
  searchUnitProducts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      unitId
      isVisible
      takeaway
      laneId
      position
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        isAvailable
        price
        availabilities {
          type
          dayFrom
          dayTo
          timeFrom
          timeTo
          price
        }
        position
        netPackagingFee
        soldOut
        ownerProduct
        externalId
      }
      configSets {
        productSetId
        items {
          productComponentId
          price
          position
          netPackagingFee
          soldOut
        }
        position
      }
      supportedServingModes
      dirty
      deletedAt
      tax
      takeawayTax
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productCategoryId
      productType
      image
      allergens
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetVariantDocument = gql`
    query GetVariant($id: ID!) {
  getVariant(id: $id) {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const ListVariantsDocument = gql`
    query ListVariants($filter: ModelVariantFilterInput, $limit: Int, $nextToken: String) {
  listVariants(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchVariantsDocument = gql`
    query SearchVariants($filter: SearchableVariantFilterInput, $sort: [SearchableVariantSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableVariantAggregationInput]) {
  searchVariants(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetAdminUserDocument = gql`
    query GetAdminUser($id: ID!) {
  getAdminUser(id: $id) {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListAdminUsersDocument = gql`
    query ListAdminUsers($filter: ModelAdminUserFilterInput, $limit: Int, $nextToken: String) {
  listAdminUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      phone
      profileImage
      settings {
        selectedUnitId
        selectedProductCategoryId
        selectedLanguage
        selectedHistoryDate
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchAdminUsersDocument = gql`
    query SearchAdminUsers($filter: SearchableAdminUserFilterInput, $sort: [SearchableAdminUserSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableAdminUserAggregationInput]) {
  searchAdminUsers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      name
      email
      phone
      profileImage
      settings {
        selectedUnitId
        selectedProductCategoryId
        selectedLanguage
        selectedHistoryDate
      }
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetOrderDocument = gql`
    query GetOrder($id: ID!) {
  getOrder(id: $id) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const ListOrdersDocument = gql`
    query ListOrders($filter: ModelOrderFilterInput, $limit: Int, $nextToken: String) {
  listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      version
      userId
      unitId
      orderNum
      items {
        productId
        variantId
        created
        productName {
          en
          de
          hu
        }
        image
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantName {
          en
          de
          hu
        }
        laneId
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      paymentMode {
        type
        caption
        method
      }
      statusLog {
        userId
        status
        ts
      }
      archived
      place {
        seat
        table
      }
      paymentIntention
      transactionStatus
      transactionId
      transaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          fcmTokens {
            token
            lastSeen
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      unpayCategory
      orderMode
      servingMode
      serviceFee {
        currency
        grossPrice
        taxContent
      }
      packagingSum {
        currency
        netPrice
        taxPercentage
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      rating {
        key
        value
      }
      hasRated
      tip {
        type
        value
      }
      tipTransactionStatus
      tipTransactionId
      tipTransaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          fcmTokens {
            token
            lastSeen
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      packagingFeeTaxPercentage
      externalId
      guestLabel
      currentStatus
      createdAt
      updatedAt
      visitId
    }
    nextToken
  }
}
    `;
export const SearchOrdersDocument = gql`
    query SearchOrders($filter: SearchableOrderFilterInput, $sort: [SearchableOrderSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableOrderAggregationInput]) {
  searchOrders(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      version
      userId
      unitId
      orderNum
      items {
        productId
        variantId
        created
        productName {
          en
          de
          hu
        }
        image
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantName {
          en
          de
          hu
        }
        laneId
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      paymentMode {
        type
        caption
        method
      }
      statusLog {
        userId
        status
        ts
      }
      archived
      place {
        seat
        table
      }
      paymentIntention
      transactionStatus
      transactionId
      transaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          fcmTokens {
            token
            lastSeen
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      unpayCategory
      orderMode
      servingMode
      serviceFee {
        currency
        grossPrice
        taxContent
      }
      packagingSum {
        currency
        netPrice
        taxPercentage
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      rating {
        key
        value
      }
      hasRated
      tip {
        type
        value
      }
      tipTransactionStatus
      tipTransactionId
      tipTransaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          fcmTokens {
            token
            lastSeen
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      packagingFeeTaxPercentage
      externalId
      guestLabel
      currentStatus
      createdAt
      updatedAt
      visitId
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetProductCategoryDocument = gql`
    query GetProductCategory($id: ID!) {
  getProductCategory(id: $id) {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const ListProductCategoriesDocument = gql`
    query ListProductCategories($filter: ModelProductCategoryFilterInput, $limit: Int, $nextToken: String) {
  listProductCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      ownerEntity
      parentId
      description {
        en
        de
        hu
      }
      image
      name {
        en
        de
        hu
      }
      position
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchProductCategoriesDocument = gql`
    query SearchProductCategories($filter: SearchableProductCategoryFilterInput, $sort: [SearchableProductCategorySortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableProductCategoryAggregationInput]) {
  searchProductCategories(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      ownerEntity
      parentId
      description {
        en
        de
        hu
      }
      image
      name {
        en
        de
        hu
      }
      position
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetProductComponentDocument = gql`
    query GetProductComponent($id: ID!) {
  getProductComponent(id: $id) {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const ListProductComponentsDocument = gql`
    query ListProductComponents($filter: ModelProductComponentFilterInput, $limit: Int, $nextToken: String) {
  listProductComponents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      ownerEntity
      name {
        en
        de
        hu
      }
      description
      allergens
      externalId
      dirty
      deletedAt
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchProductComponentsDocument = gql`
    query SearchProductComponents($filter: SearchableProductComponentFilterInput, $sort: [SearchableProductComponentSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableProductComponentAggregationInput]) {
  searchProductComponents(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      ownerEntity
      name {
        en
        de
        hu
      }
      description
      allergens
      externalId
      dirty
      deletedAt
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetProductComponentSetDocument = gql`
    query GetProductComponentSet($id: ID!) {
  getProductComponentSet(id: $id) {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const ListProductComponentSetsDocument = gql`
    query ListProductComponentSets($filter: ModelProductComponentSetFilterInput, $limit: Int, $nextToken: String) {
  listProductComponentSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      externalId
      ownerEntity
      type
      name {
        en
        de
        hu
      }
      description
      items
      maxSelection
      supportedServingModes
      dirty
      deletedAt
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchProductComponentSetsDocument = gql`
    query SearchProductComponentSets($filter: SearchableProductComponentSetFilterInput, $sort: [SearchableProductComponentSetSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableProductComponentSetAggregationInput]) {
  searchProductComponentSets(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      externalId
      ownerEntity
      type
      name {
        en
        de
        hu
      }
      description
      items
      maxSelection
      supportedServingModes
      dirty
      deletedAt
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetFavoriteProductDocument = gql`
    query GetFavoriteProduct($id: ID!) {
  getFavoriteProduct(id: $id) {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListFavoriteProductsDocument = gql`
    query ListFavoriteProducts($filter: ModelFavoriteProductFilterInput, $limit: Int, $nextToken: String) {
  listFavoriteProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      unitId
      product {
        id
        unitId
        productCategoryId
        name {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        productType
        tax
        takeawayTax
        position
        image
        variants {
          id
          variantName {
            en
            de
            hu
          }
          pack {
            size
            unit
          }
          price
          netPackagingFee
          position
          soldOut
        }
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          position
          type
          maxSelection
          items {
            productComponentId
            price
            position
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            soldOut
            externalId
          }
          supportedServingModes
        }
        supportedServingModes
        soldOut
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchFavoriteProductsDocument = gql`
    query SearchFavoriteProducts($filter: SearchableFavoriteProductFilterInput, $sort: [SearchableFavoriteProductSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableFavoriteProductAggregationInput]) {
  searchFavoriteProducts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      userId
      unitId
      product {
        id
        unitId
        productCategoryId
        name {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        productType
        tax
        takeawayTax
        position
        image
        variants {
          id
          variantName {
            en
            de
            hu
          }
          pack {
            size
            unit
          }
          price
          netPackagingFee
          position
          soldOut
        }
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          position
          type
          maxSelection
          items {
            productComponentId
            price
            position
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            soldOut
            externalId
          }
          supportedServingModes
        }
        supportedServingModes
        soldOut
      }
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetUnitDocument = gql`
    query GetUnit($id: ID!) {
  getUnit(id: $id) {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListUnitsDocument = gql`
    query ListUnits($filter: ModelUnitFilterInput, $limit: Int, $nextToken: String) {
  listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      adBanners {
        imageUrl
      }
      adBannersEnabled
      coverBanners {
        imageUrl
      }
      lastOrderNum
      isActive
      isAcceptingOrders
      name
      description {
        en
        de
        hu
      }
      address {
        address
        city
        country
        title
        postalCode
        location {
          lat
          lng
        }
      }
      email
      phone
      paymentModes {
        type
        caption
        method
      }
      floorMap {
        w
        h
        objects {
          id
          t
          c
          w
          h
          r
          a
          x
          y
          tID
          sID
        }
      }
      lanes {
        id
        name
        color
      }
      open {
        from
        to
      }
      openingHours {
        mon {
          from
          to
        }
        tue {
          from
          to
        }
        wed {
          from
          to
        }
        thu {
          from
          to
        }
        fri {
          from
          to
        }
        sat {
          from
          to
        }
        sun {
          from
          to
        }
        custom {
          date
          from
          to
        }
      }
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
          waiterOrderId
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lon
      }
      canRequestVatInvoice
      canCallWaiter
      isVisibleInApp
      currency
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
        }
        images {
          header
          logo
        }
      }
      categoryOrders {
        id
        parentId
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchUnitsDocument = gql`
    query SearchUnits($filter: SearchableUnitFilterInput, $sort: [SearchableUnitSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableUnitAggregationInput]) {
  searchUnits(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      adBanners {
        imageUrl
      }
      adBannersEnabled
      coverBanners {
        imageUrl
      }
      lastOrderNum
      isActive
      isAcceptingOrders
      name
      description {
        en
        de
        hu
      }
      address {
        address
        city
        country
        title
        postalCode
        location {
          lat
          lng
        }
      }
      email
      phone
      paymentModes {
        type
        caption
        method
      }
      floorMap {
        w
        h
        objects {
          id
          t
          c
          w
          h
          r
          a
          x
          y
          tID
          sID
        }
      }
      lanes {
        id
        name
        color
      }
      open {
        from
        to
      }
      openingHours {
        mon {
          from
          to
        }
        tue {
          from
          to
        }
        wed {
          from
          to
        }
        thu {
          from
          to
        }
        fri {
          from
          to
        }
        sat {
          from
          to
        }
        sun {
          from
          to
        }
        custom {
          date
          from
          to
        }
      }
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
          waiterOrderId
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lon
      }
      canRequestVatInvoice
      canCallWaiter
      isVisibleInApp
      currency
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
        }
        images {
          header
          logo
        }
      }
      categoryOrders {
        id
        parentId
      }
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetUserDocument = gql`
    query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListUsersDocument = gql`
    query ListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchUsersDocument = gql`
    query SearchUsers($filter: SearchableUserFilterInput, $sort: [SearchableUserSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableUserAggregationInput]) {
  searchUsers(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetCartDocument = gql`
    query GetCart($id: ID!) {
  getCart(id: $id) {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const ListCartsDocument = gql`
    query ListCarts($filter: ModelCartFilterInput, $limit: Int, $nextToken: String) {
  listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      version
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        type
        caption
        method
      }
      items {
        productId
        variantId
        created
        productName {
          en
          de
          hu
        }
        image
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantName {
          en
          de
          hu
        }
        laneId
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      servingMode
      orderMode
      orderPolicy
      guestLabel
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchCartsDocument = gql`
    query SearchCarts($filter: SearchableCartFilterInput, $sort: [SearchableCartSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableCartAggregationInput]) {
  searchCarts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      version
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        type
        caption
        method
      }
      items {
        productId
        variantId
        created
        productName {
          en
          de
          hu
        }
        image
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantName {
          en
          de
          hu
        }
        laneId
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      servingMode
      orderMode
      orderPolicy
      guestLabel
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetTransactionDocument = gql`
    query GetTransaction($id: ID!) {
  getTransaction(id: $id) {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const ListTransactionsDocument = gql`
    query ListTransactions($filter: ModelTransactionFilterInput, $limit: Int, $nextToken: String) {
  listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    nextToken
  }
}
    `;
export const SearchTransactionsDocument = gql`
    query SearchTransactions($filter: SearchableTransactionFilterInput, $sort: [SearchableTransactionSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableTransactionAggregationInput]) {
  searchTransactions(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetInvoiceDocument = gql`
    query GetInvoice($id: ID!) {
  getInvoice(id: $id) {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListInvoicesDocument = gql`
    query ListInvoices($filter: ModelInvoiceFilterInput, $limit: Int, $nextToken: String) {
  listInvoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchInvoicesDocument = gql`
    query SearchInvoices($filter: SearchableInvoiceFilterInput, $sort: [SearchableInvoiceSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableInvoiceAggregationInput]) {
  searchInvoices(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const GetReceiptDocument = gql`
    query GetReceipt($id: ID!) {
  getReceipt(id: $id) {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListReceiptsDocument = gql`
    query ListReceipts($filter: ModelReceiptFilterInput, $limit: Int, $nextToken: String) {
  listReceipts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    nextToken
  }
}
    `;
export const SearchReceiptsDocument = gql`
    query SearchReceipts($filter: SearchableReceiptFilterInput, $sort: [SearchableReceiptSortInput], $limit: Int, $nextToken: String, $from: Int, $aggregates: [SearchableReceiptAggregationInput]) {
  searchReceipts(
    filter: $filter
    sort: $sort
    limit: $limit
    nextToken: $nextToken
    from: $from
    aggregates: $aggregates
  ) {
    items {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    nextToken
    total
    aggregateItems {
      name
      result {
        ... on SearchableAggregateScalarResult {
          value
        }
        ... on SearchableAggregateBucketResult {
          buckets {
            key
            doc_count
          }
        }
      }
    }
  }
}
    `;
export const OnAdminUserChangeDocument = gql`
    subscription OnAdminUserChange($id: ID!) {
  onAdminUserChange(id: $id) {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnAdminUsersChangeDocument = gql`
    subscription OnAdminUsersChange {
  onAdminUsersChange {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnProductCategoriesChangeDocument = gql`
    subscription OnProductCategoriesChange($unitId: ID!) {
  onProductCategoriesChange(unitId: $unitId) {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const OnProductComponentsChangeDocument = gql`
    subscription OnProductComponentsChange($unitId: ID!) {
  onProductComponentsChange(unitId: $unitId) {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnProductComponentSetsChangeDocument = gql`
    subscription OnProductComponentSetsChange($unitId: ID!) {
  onProductComponentSetsChange(unitId: $unitId) {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnUnitProductChangeDocument = gql`
    subscription OnUnitProductChange($unitId: ID!) {
  onUnitProductChange(unitId: $unitId) {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const OnOrdersChangeDocument = gql`
    subscription OnOrdersChange {
  onOrdersChange {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnOrdersDeleteDocument = gql`
    subscription OnOrdersDelete {
  onOrdersDelete {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnOrderChangedDocument = gql`
    subscription OnOrderChanged($userId: String, $unitId: String, $archived: Boolean) {
  onOrderChanged(userId: $userId, unitId: $unitId, archived: $archived) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnUnitOrdersChangeDocument = gql`
    subscription OnUnitOrdersChange($unitId: String, $archived: Boolean) {
  onUnitOrdersChange(unitId: $unitId, archived: $archived) {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnCreateUnitProductDocument = gql`
    subscription OnCreateUnitProduct {
  onCreateUnitProduct {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateUnitProductDocument = gql`
    subscription OnUpdateUnitProduct {
  onUpdateUnitProduct {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteUnitProductDocument = gql`
    subscription OnDeleteUnitProduct {
  onDeleteUnitProduct {
    id
    unitId
    isVisible
    takeaway
    laneId
    position
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
      netPackagingFee
      soldOut
      ownerProduct
      externalId
    }
    configSets {
      productSetId
      items {
        productComponentId
        price
        position
        netPackagingFee
        soldOut
      }
      position
    }
    supportedServingModes
    dirty
    deletedAt
    tax
    takeawayTax
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    image
    allergens
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateVariantDocument = gql`
    subscription OnCreateVariant {
  onCreateVariant {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateVariantDocument = gql`
    subscription OnUpdateVariant {
  onUpdateVariant {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteVariantDocument = gql`
    subscription OnDeleteVariant {
  onDeleteVariant {
    id
    variantName {
      en
      de
      hu
    }
    pack {
      size
      unit
    }
    isAvailable
    price
    availabilities {
      type
      dayFrom
      dayTo
      timeFrom
      timeTo
      price
    }
    position
    netPackagingFee
    soldOut
    ownerProduct
    externalId
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateAdminUserDocument = gql`
    subscription OnUpdateAdminUser {
  onUpdateAdminUser {
    id
    name
    email
    phone
    profileImage
    settings {
      selectedUnitId
      selectedProductCategoryId
      selectedLanguage
      selectedHistoryDate
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateOrderDocument = gql`
    subscription OnUpdateOrder {
  onUpdateOrder {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnDeleteOrderDocument = gql`
    subscription OnDeleteOrder {
  onDeleteOrder {
    id
    version
    userId
    unitId
    orderNum
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    paymentMode {
      type
      caption
      method
    }
    statusLog {
      userId
      status
      ts
    }
    archived
    place {
      seat
      table
    }
    paymentIntention
    transactionStatus
    transactionId
    transaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    unpayCategory
    orderMode
    servingMode
    serviceFee {
      currency
      grossPrice
      taxContent
    }
    packagingSum {
      currency
      netPrice
      taxPercentage
    }
    sumPriceShown {
      currency
      pricePerUnit
      priceSum
      tax
      taxSum
    }
    rating {
      key
      value
    }
    hasRated
    tip {
      type
      value
    }
    tipTransactionStatus
    tipTransactionId
    tipTransaction {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        fcmTokens {
          token
          lastSeen
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
    orderPolicy
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    packagingFeeTaxPercentage
    externalId
    guestLabel
    currentStatus
    createdAt
    updatedAt
    visitId
  }
}
    `;
export const OnCreateProductCategoryDocument = gql`
    subscription OnCreateProductCategory {
  onCreateProductCategory {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateProductCategoryDocument = gql`
    subscription OnUpdateProductCategory {
  onUpdateProductCategory {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteProductCategoryDocument = gql`
    subscription OnDeleteProductCategory {
  onDeleteProductCategory {
    id
    ownerEntity
    parentId
    description {
      en
      de
      hu
    }
    image
    name {
      en
      de
      hu
    }
    position
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateProductComponentDocument = gql`
    subscription OnCreateProductComponent {
  onCreateProductComponent {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateProductComponentDocument = gql`
    subscription OnUpdateProductComponent {
  onUpdateProductComponent {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteProductComponentDocument = gql`
    subscription OnDeleteProductComponent {
  onDeleteProductComponent {
    id
    ownerEntity
    name {
      en
      de
      hu
    }
    description
    allergens
    externalId
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateProductComponentSetDocument = gql`
    subscription OnCreateProductComponentSet {
  onCreateProductComponentSet {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateProductComponentSetDocument = gql`
    subscription OnUpdateProductComponentSet {
  onUpdateProductComponentSet {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteProductComponentSetDocument = gql`
    subscription OnDeleteProductComponentSet {
  onDeleteProductComponentSet {
    id
    externalId
    ownerEntity
    type
    name {
      en
      de
      hu
    }
    description
    items
    maxSelection
    supportedServingModes
    dirty
    deletedAt
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateFavoriteProductDocument = gql`
    subscription OnCreateFavoriteProduct {
  onCreateFavoriteProduct {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateFavoriteProductDocument = gql`
    subscription OnUpdateFavoriteProduct {
  onUpdateFavoriteProduct {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteFavoriteProductDocument = gql`
    subscription OnDeleteFavoriteProduct {
  onDeleteFavoriteProduct {
    id
    userId
    unitId
    product {
      id
      unitId
      productCategoryId
      name {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      productType
      tax
      takeawayTax
      position
      image
      variants {
        id
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteUnitDocument = gql`
    subscription OnDeleteUnit {
  onDeleteUnit {
    id
    adBanners {
      imageUrl
    }
    adBannersEnabled
    coverBanners {
      imageUrl
    }
    lastOrderNum
    isActive
    isAcceptingOrders
    name
    description {
      en
      de
      hu
    }
    address {
      address
      city
      country
      title
      postalCode
      location {
        lat
        lng
      }
    }
    email
    phone
    paymentModes {
      type
      caption
      method
    }
    floorMap {
      w
      h
      objects {
        id
        t
        c
        w
        h
        r
        a
        x
        y
        tID
        sID
      }
    }
    lanes {
      id
      name
      color
    }
    open {
      from
      to
    }
    openingHours {
      mon {
        from
        to
      }
      tue {
        from
        to
      }
      wed {
        from
        to
      }
      thu {
        from
        to
      }
      fri {
        from
        to
      }
      sat {
        from
        to
      }
      sun {
        from
        to
      }
      custom {
        date
        from
        to
      }
    }
    merchantId
    timeZone
    pos {
      type
      rkeeper {
        endpointUri
        rkeeperUsername
        rkeeperPassword
        anyuppUsername
        anyuppPassword
        waiterOrderId
      }
    }
    externalId
    supportedServingModes
    supportedOrderModes
    orderPolicy
    packagingTaxPercentage
    serviceFeePolicy {
      type
      percentage
    }
    ratingPolicies {
      key
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      ratings {
        value
        text {
          en
          de
          hu
        }
        icon
      }
    }
    tipPolicy {
      title {
        en
        de
        hu
      }
      description {
        en
        de
        hu
      }
      percents
      minOtherAmount
    }
    soldOutVisibilityPolicy
    orderPaymentPolicy
    location {
      lat
      lon
    }
    canRequestVatInvoice
    canCallWaiter
    isVisibleInApp
    currency
    style {
      colors {
        backgroundLight
        backgroundDark
        borderLight
        borderDark
        disabled
        indicator
        textLight
        textDark
        primary
        secondary
        button
        buttonText
        icon
        highlight
      }
      images {
        header
        logo
      }
    }
    categoryOrders {
      id
      parentId
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateUserDocument = gql`
    subscription OnCreateUser {
  onCreateUser {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateUserDocument = gql`
    subscription OnUpdateUser {
  onUpdateUser {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteUserDocument = gql`
    subscription OnDeleteUser {
  onDeleteUser {
    id
    name
    email
    phone
    profileImage
    stripeCustomerId
    invoiceAddress {
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
    }
    fcmTokens {
      token
      lastSeen
    }
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateCartDocument = gql`
    subscription OnCreateCart {
  onCreateCart {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateCartDocument = gql`
    subscription OnUpdateCart {
  onUpdateCart {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteCartDocument = gql`
    subscription OnDeleteCart {
  onDeleteCart {
    id
    version
    userId
    unitId
    takeAway
    place {
      seat
      table
    }
    paymentMode {
      type
      caption
      method
    }
    items {
      productId
      variantId
      created
      productName {
        en
        de
        hu
      }
      image
      quantity
      statusLog {
        userId
        status
        ts
      }
      variantName {
        en
        de
        hu
      }
      laneId
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        type
        items {
          productComponentId
          price
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          externalId
        }
      }
      productType
      externalId
      netPackagingFee
      serviceFee {
        currency
        netPrice
        taxPercentage
      }
      priceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
    }
    servingMode
    orderMode
    orderPolicy
    guestLabel
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateTransactionDocument = gql`
    subscription OnCreateTransaction {
  onCreateTransaction {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const OnUpdateTransactionDocument = gql`
    subscription OnUpdateTransaction {
  onUpdateTransaction {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const OnDeleteTransactionDocument = gql`
    subscription OnDeleteTransaction {
  onDeleteTransaction {
    id
    userId
    user {
      id
      name
      email
      phone
      profileImage
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
      fcmTokens {
        token
        lastSeen
      }
      createdAt
      updatedAt
    }
    orderId
    type
    total
    currency
    status
    externalTransactionId
    invoiceId
    invoice {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
    receiptId
    receipt {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
    paymentMethodId
  }
}
    `;
export const OnCreateInvoiceDocument = gql`
    subscription OnCreateInvoice {
  onCreateInvoice {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateInvoiceDocument = gql`
    subscription OnUpdateInvoice {
  onUpdateInvoice {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteInvoiceDocument = gql`
    subscription OnDeleteInvoice {
  onDeleteInvoice {
    id
    userId
    orderId
    transactionId
    externalInvoiceId
    customerName
    taxNumber
    country
    city
    streetAddress
    postalCode
    email
    pdfUrl
    status
    createdAt
    updatedAt
  }
}
    `;
export const OnCreateReceiptDocument = gql`
    subscription OnCreateReceipt {
  onCreateReceipt {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const OnUpdateReceiptDocument = gql`
    subscription OnUpdateReceipt {
  onUpdateReceipt {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export const OnDeleteReceiptDocument = gql`
    subscription OnDeleteReceipt {
  onDeleteReceipt {
    id
    userId
    orderId
    transactionId
    externalReceiptId
    email
    pdfData
    status
    createdAt
    updatedAt
  }
}
    `;
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> & Observable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    SearchReportOrders(variables?: SearchReportOrdersQueryVariables, options?: C): Promise<SearchReportOrdersQuery> {
      return requester<SearchReportOrdersQuery, SearchReportOrdersQueryVariables>(SearchReportOrdersDocument, variables, options);
    },
    SearchUnitIds(variables?: SearchUnitIdsQueryVariables, options?: C): Promise<SearchUnitIdsQuery> {
      return requester<SearchUnitIdsQuery, SearchUnitIdsQueryVariables>(SearchUnitIdsDocument, variables, options);
    },
    SearchUnitProductIds(variables?: SearchUnitProductIdsQueryVariables, options?: C): Promise<SearchUnitProductIdsQuery> {
      return requester<SearchUnitProductIdsQuery, SearchUnitProductIdsQueryVariables>(SearchUnitProductIdsDocument, variables, options);
    },
    SearchProductCategoryIds(variables?: SearchProductCategoryIdsQueryVariables, options?: C): Promise<SearchProductCategoryIdsQuery> {
      return requester<SearchProductCategoryIdsQuery, SearchProductCategoryIdsQueryVariables>(SearchProductCategoryIdsDocument, variables, options);
    },
    SearchProductComponentIds(variables?: SearchProductComponentIdsQueryVariables, options?: C): Promise<SearchProductComponentIdsQuery> {
      return requester<SearchProductComponentIdsQuery, SearchProductComponentIdsQueryVariables>(SearchProductComponentIdsDocument, variables, options);
    },
    SearchProductComponentSetIds(variables?: SearchProductComponentSetIdsQueryVariables, options?: C): Promise<SearchProductComponentSetIdsQuery> {
      return requester<SearchProductComponentSetIdsQuery, SearchProductComponentSetIdsQueryVariables>(SearchProductComponentSetIdsDocument, variables, options);
    },
    SearchAdminUserIds(variables?: SearchAdminUserIdsQueryVariables, options?: C): Promise<SearchAdminUserIdsQuery> {
      return requester<SearchAdminUserIdsQuery, SearchAdminUserIdsQueryVariables>(SearchAdminUserIdsDocument, variables, options);
    },
    SearchOrderIds(variables?: SearchOrderIdsQueryVariables, options?: C): Promise<SearchOrderIdsQuery> {
      return requester<SearchOrderIdsQuery, SearchOrderIdsQueryVariables>(SearchOrderIdsDocument, variables, options);
    },
    CreateUnit(variables: CreateUnitMutationVariables, options?: C): Promise<CreateUnitMutation> {
      return requester<CreateUnitMutation, CreateUnitMutationVariables>(CreateUnitDocument, variables, options);
    },
    UpdateUnit(variables: UpdateUnitMutationVariables, options?: C): Promise<UpdateUnitMutation> {
      return requester<UpdateUnitMutation, UpdateUnitMutationVariables>(UpdateUnitDocument, variables, options);
    },
    UpdateUnitRKeeperData(variables: UpdateUnitRKeeperDataMutationVariables, options?: C): Promise<UpdateUnitRKeeperDataMutation> {
      return requester<UpdateUnitRKeeperDataMutation, UpdateUnitRKeeperDataMutationVariables>(UpdateUnitRKeeperDataDocument, variables, options);
    },
    CreateAdminUser(variables: CreateAdminUserMutationVariables, options?: C): Promise<CreateAdminUserMutation> {
      return requester<CreateAdminUserMutation, CreateAdminUserMutationVariables>(CreateAdminUserDocument, variables, options);
    },
    DeleteAdminUser(variables: DeleteAdminUserMutationVariables, options?: C): Promise<DeleteAdminUserMutation> {
      return requester<DeleteAdminUserMutation, DeleteAdminUserMutationVariables>(DeleteAdminUserDocument, variables, options);
    },
    CreateAnonymUser(variables?: CreateAnonymUserMutationVariables, options?: C): Promise<CreateAnonymUserMutation> {
      return requester<CreateAnonymUserMutation, CreateAnonymUserMutationVariables>(CreateAnonymUserDocument, variables, options);
    },
    CreateOrderFromCart(variables: CreateOrderFromCartMutationVariables, options?: C): Promise<CreateOrderFromCartMutation> {
      return requester<CreateOrderFromCartMutation, CreateOrderFromCartMutationVariables>(CreateOrderFromCartDocument, variables, options);
    },
    CreateOrder(variables: CreateOrderMutationVariables, options?: C): Promise<CreateOrderMutation> {
      return requester<CreateOrderMutation, CreateOrderMutationVariables>(CreateOrderDocument, variables, options);
    },
    StartStripePayment(variables: StartStripePaymentMutationVariables, options?: C): Promise<StartStripePaymentMutation> {
      return requester<StartStripePaymentMutation, StartStripePaymentMutationVariables>(StartStripePaymentDocument, variables, options);
    },
    StartStripePaymentConnected(variables: StartStripePaymentConnectedMutationVariables, options?: C): Promise<StartStripePaymentConnectedMutation> {
      return requester<StartStripePaymentConnectedMutation, StartStripePaymentConnectedMutationVariables>(StartStripePaymentConnectedDocument, variables, options);
    },
    PayTipWithStripe(variables: PayTipWithStripeMutationVariables, options?: C): Promise<PayTipWithStripeMutation> {
      return requester<PayTipWithStripeMutation, PayTipWithStripeMutationVariables>(PayTipWithStripeDocument, variables, options);
    },
    CreateStripeCard(variables: CreateStripeCardMutationVariables, options?: C): Promise<CreateStripeCardMutation> {
      return requester<CreateStripeCardMutation, CreateStripeCardMutationVariables>(CreateStripeCardDocument, variables, options);
    },
    UpdateMyStripeCard(variables: UpdateMyStripeCardMutationVariables, options?: C): Promise<UpdateMyStripeCardMutation> {
      return requester<UpdateMyStripeCardMutation, UpdateMyStripeCardMutationVariables>(UpdateMyStripeCardDocument, variables, options);
    },
    DeleteMyStripeCard(variables: DeleteMyStripeCardMutationVariables, options?: C): Promise<DeleteMyStripeCardMutation> {
      return requester<DeleteMyStripeCardMutation, DeleteMyStripeCardMutationVariables>(DeleteMyStripeCardDocument, variables, options);
    },
    CallWaiter(variables?: CallWaiterMutationVariables, options?: C): Promise<CallWaiterMutation> {
      return requester<CallWaiterMutation, CallWaiterMutationVariables>(CallWaiterDocument, variables, options);
    },
    CreateUnitProduct(variables: CreateUnitProductMutationVariables, options?: C): Promise<CreateUnitProductMutation> {
      return requester<CreateUnitProductMutation, CreateUnitProductMutationVariables>(CreateUnitProductDocument, variables, options);
    },
    UpdateUnitProduct(variables: UpdateUnitProductMutationVariables, options?: C): Promise<UpdateUnitProductMutation> {
      return requester<UpdateUnitProductMutation, UpdateUnitProductMutationVariables>(UpdateUnitProductDocument, variables, options);
    },
    DeleteUnitProduct(variables: DeleteUnitProductMutationVariables, options?: C): Promise<DeleteUnitProductMutation> {
      return requester<DeleteUnitProductMutation, DeleteUnitProductMutationVariables>(DeleteUnitProductDocument, variables, options);
    },
    CreateVariant(variables: CreateVariantMutationVariables, options?: C): Promise<CreateVariantMutation> {
      return requester<CreateVariantMutation, CreateVariantMutationVariables>(CreateVariantDocument, variables, options);
    },
    UpdateVariant(variables: UpdateVariantMutationVariables, options?: C): Promise<UpdateVariantMutation> {
      return requester<UpdateVariantMutation, UpdateVariantMutationVariables>(UpdateVariantDocument, variables, options);
    },
    DeleteVariant(variables: DeleteVariantMutationVariables, options?: C): Promise<DeleteVariantMutation> {
      return requester<DeleteVariantMutation, DeleteVariantMutationVariables>(DeleteVariantDocument, variables, options);
    },
    UpdateAdminUser(variables: UpdateAdminUserMutationVariables, options?: C): Promise<UpdateAdminUserMutation> {
      return requester<UpdateAdminUserMutation, UpdateAdminUserMutationVariables>(UpdateAdminUserDocument, variables, options);
    },
    UpdateOrder(variables: UpdateOrderMutationVariables, options?: C): Promise<UpdateOrderMutation> {
      return requester<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument, variables, options);
    },
    DeleteOrder(variables: DeleteOrderMutationVariables, options?: C): Promise<DeleteOrderMutation> {
      return requester<DeleteOrderMutation, DeleteOrderMutationVariables>(DeleteOrderDocument, variables, options);
    },
    CreateProductCategory(variables: CreateProductCategoryMutationVariables, options?: C): Promise<CreateProductCategoryMutation> {
      return requester<CreateProductCategoryMutation, CreateProductCategoryMutationVariables>(CreateProductCategoryDocument, variables, options);
    },
    UpdateProductCategory(variables: UpdateProductCategoryMutationVariables, options?: C): Promise<UpdateProductCategoryMutation> {
      return requester<UpdateProductCategoryMutation, UpdateProductCategoryMutationVariables>(UpdateProductCategoryDocument, variables, options);
    },
    DeleteProductCategory(variables: DeleteProductCategoryMutationVariables, options?: C): Promise<DeleteProductCategoryMutation> {
      return requester<DeleteProductCategoryMutation, DeleteProductCategoryMutationVariables>(DeleteProductCategoryDocument, variables, options);
    },
    CreateProductComponent(variables: CreateProductComponentMutationVariables, options?: C): Promise<CreateProductComponentMutation> {
      return requester<CreateProductComponentMutation, CreateProductComponentMutationVariables>(CreateProductComponentDocument, variables, options);
    },
    UpdateProductComponent(variables: UpdateProductComponentMutationVariables, options?: C): Promise<UpdateProductComponentMutation> {
      return requester<UpdateProductComponentMutation, UpdateProductComponentMutationVariables>(UpdateProductComponentDocument, variables, options);
    },
    DeleteProductComponent(variables: DeleteProductComponentMutationVariables, options?: C): Promise<DeleteProductComponentMutation> {
      return requester<DeleteProductComponentMutation, DeleteProductComponentMutationVariables>(DeleteProductComponentDocument, variables, options);
    },
    CreateProductComponentSet(variables: CreateProductComponentSetMutationVariables, options?: C): Promise<CreateProductComponentSetMutation> {
      return requester<CreateProductComponentSetMutation, CreateProductComponentSetMutationVariables>(CreateProductComponentSetDocument, variables, options);
    },
    UpdateProductComponentSet(variables: UpdateProductComponentSetMutationVariables, options?: C): Promise<UpdateProductComponentSetMutation> {
      return requester<UpdateProductComponentSetMutation, UpdateProductComponentSetMutationVariables>(UpdateProductComponentSetDocument, variables, options);
    },
    DeleteProductComponentSet(variables: DeleteProductComponentSetMutationVariables, options?: C): Promise<DeleteProductComponentSetMutation> {
      return requester<DeleteProductComponentSetMutation, DeleteProductComponentSetMutationVariables>(DeleteProductComponentSetDocument, variables, options);
    },
    CreateFavoriteProduct(variables: CreateFavoriteProductMutationVariables, options?: C): Promise<CreateFavoriteProductMutation> {
      return requester<CreateFavoriteProductMutation, CreateFavoriteProductMutationVariables>(CreateFavoriteProductDocument, variables, options);
    },
    UpdateFavoriteProduct(variables: UpdateFavoriteProductMutationVariables, options?: C): Promise<UpdateFavoriteProductMutation> {
      return requester<UpdateFavoriteProductMutation, UpdateFavoriteProductMutationVariables>(UpdateFavoriteProductDocument, variables, options);
    },
    DeleteFavoriteProduct(variables: DeleteFavoriteProductMutationVariables, options?: C): Promise<DeleteFavoriteProductMutation> {
      return requester<DeleteFavoriteProductMutation, DeleteFavoriteProductMutationVariables>(DeleteFavoriteProductDocument, variables, options);
    },
    DeleteUnit(variables: DeleteUnitMutationVariables, options?: C): Promise<DeleteUnitMutation> {
      return requester<DeleteUnitMutation, DeleteUnitMutationVariables>(DeleteUnitDocument, variables, options);
    },
    CreateUser(variables: CreateUserMutationVariables, options?: C): Promise<CreateUserMutation> {
      return requester<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, variables, options);
    },
    UpdateUser(variables: UpdateUserMutationVariables, options?: C): Promise<UpdateUserMutation> {
      return requester<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, variables, options);
    },
    DeleteUser(variables: DeleteUserMutationVariables, options?: C): Promise<DeleteUserMutation> {
      return requester<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, variables, options);
    },
    CreateCart(variables: CreateCartMutationVariables, options?: C): Promise<CreateCartMutation> {
      return requester<CreateCartMutation, CreateCartMutationVariables>(CreateCartDocument, variables, options);
    },
    UpdateCart(variables: UpdateCartMutationVariables, options?: C): Promise<UpdateCartMutation> {
      return requester<UpdateCartMutation, UpdateCartMutationVariables>(UpdateCartDocument, variables, options);
    },
    DeleteCart(variables: DeleteCartMutationVariables, options?: C): Promise<DeleteCartMutation> {
      return requester<DeleteCartMutation, DeleteCartMutationVariables>(DeleteCartDocument, variables, options);
    },
    CreateTransaction(variables: CreateTransactionMutationVariables, options?: C): Promise<CreateTransactionMutation> {
      return requester<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, variables, options);
    },
    UpdateTransaction(variables: UpdateTransactionMutationVariables, options?: C): Promise<UpdateTransactionMutation> {
      return requester<UpdateTransactionMutation, UpdateTransactionMutationVariables>(UpdateTransactionDocument, variables, options);
    },
    DeleteTransaction(variables: DeleteTransactionMutationVariables, options?: C): Promise<DeleteTransactionMutation> {
      return requester<DeleteTransactionMutation, DeleteTransactionMutationVariables>(DeleteTransactionDocument, variables, options);
    },
    CreateInvoice(variables: CreateInvoiceMutationVariables, options?: C): Promise<CreateInvoiceMutation> {
      return requester<CreateInvoiceMutation, CreateInvoiceMutationVariables>(CreateInvoiceDocument, variables, options);
    },
    UpdateInvoice(variables: UpdateInvoiceMutationVariables, options?: C): Promise<UpdateInvoiceMutation> {
      return requester<UpdateInvoiceMutation, UpdateInvoiceMutationVariables>(UpdateInvoiceDocument, variables, options);
    },
    DeleteInvoice(variables: DeleteInvoiceMutationVariables, options?: C): Promise<DeleteInvoiceMutation> {
      return requester<DeleteInvoiceMutation, DeleteInvoiceMutationVariables>(DeleteInvoiceDocument, variables, options);
    },
    CreateReceipt(variables: CreateReceiptMutationVariables, options?: C): Promise<CreateReceiptMutation> {
      return requester<CreateReceiptMutation, CreateReceiptMutationVariables>(CreateReceiptDocument, variables, options);
    },
    UpdateReceipt(variables: UpdateReceiptMutationVariables, options?: C): Promise<UpdateReceiptMutation> {
      return requester<UpdateReceiptMutation, UpdateReceiptMutationVariables>(UpdateReceiptDocument, variables, options);
    },
    DeleteReceipt(variables: DeleteReceiptMutationVariables, options?: C): Promise<DeleteReceiptMutation> {
      return requester<DeleteReceiptMutation, DeleteReceiptMutationVariables>(DeleteReceiptDocument, variables, options);
    },
    ListStripeCards(variables?: ListStripeCardsQueryVariables, options?: C): Promise<ListStripeCardsQuery> {
      return requester<ListStripeCardsQuery, ListStripeCardsQueryVariables>(ListStripeCardsDocument, variables, options);
    },
    GetUnitsNearLocation(variables: GetUnitsNearLocationQueryVariables, options?: C): Promise<GetUnitsNearLocationQuery> {
      return requester<GetUnitsNearLocationQuery, GetUnitsNearLocationQueryVariables>(GetUnitsNearLocationDocument, variables, options);
    },
    SearchByRadius(variables: SearchByRadiusQueryVariables, options?: C): Promise<SearchByRadiusQuery> {
      return requester<SearchByRadiusQuery, SearchByRadiusQueryVariables>(SearchByRadiusDocument, variables, options);
    },
    GetUnitProduct(variables: GetUnitProductQueryVariables, options?: C): Promise<GetUnitProductQuery> {
      return requester<GetUnitProductQuery, GetUnitProductQueryVariables>(GetUnitProductDocument, variables, options);
    },
    ListUnitProducts(variables?: ListUnitProductsQueryVariables, options?: C): Promise<ListUnitProductsQuery> {
      return requester<ListUnitProductsQuery, ListUnitProductsQueryVariables>(ListUnitProductsDocument, variables, options);
    },
    SearchUnitProducts(variables?: SearchUnitProductsQueryVariables, options?: C): Promise<SearchUnitProductsQuery> {
      return requester<SearchUnitProductsQuery, SearchUnitProductsQueryVariables>(SearchUnitProductsDocument, variables, options);
    },
    GetVariant(variables: GetVariantQueryVariables, options?: C): Promise<GetVariantQuery> {
      return requester<GetVariantQuery, GetVariantQueryVariables>(GetVariantDocument, variables, options);
    },
    ListVariants(variables?: ListVariantsQueryVariables, options?: C): Promise<ListVariantsQuery> {
      return requester<ListVariantsQuery, ListVariantsQueryVariables>(ListVariantsDocument, variables, options);
    },
    SearchVariants(variables?: SearchVariantsQueryVariables, options?: C): Promise<SearchVariantsQuery> {
      return requester<SearchVariantsQuery, SearchVariantsQueryVariables>(SearchVariantsDocument, variables, options);
    },
    GetAdminUser(variables: GetAdminUserQueryVariables, options?: C): Promise<GetAdminUserQuery> {
      return requester<GetAdminUserQuery, GetAdminUserQueryVariables>(GetAdminUserDocument, variables, options);
    },
    ListAdminUsers(variables?: ListAdminUsersQueryVariables, options?: C): Promise<ListAdminUsersQuery> {
      return requester<ListAdminUsersQuery, ListAdminUsersQueryVariables>(ListAdminUsersDocument, variables, options);
    },
    SearchAdminUsers(variables?: SearchAdminUsersQueryVariables, options?: C): Promise<SearchAdminUsersQuery> {
      return requester<SearchAdminUsersQuery, SearchAdminUsersQueryVariables>(SearchAdminUsersDocument, variables, options);
    },
    GetOrder(variables: GetOrderQueryVariables, options?: C): Promise<GetOrderQuery> {
      return requester<GetOrderQuery, GetOrderQueryVariables>(GetOrderDocument, variables, options);
    },
    ListOrders(variables?: ListOrdersQueryVariables, options?: C): Promise<ListOrdersQuery> {
      return requester<ListOrdersQuery, ListOrdersQueryVariables>(ListOrdersDocument, variables, options);
    },
    SearchOrders(variables?: SearchOrdersQueryVariables, options?: C): Promise<SearchOrdersQuery> {
      return requester<SearchOrdersQuery, SearchOrdersQueryVariables>(SearchOrdersDocument, variables, options);
    },
    GetProductCategory(variables: GetProductCategoryQueryVariables, options?: C): Promise<GetProductCategoryQuery> {
      return requester<GetProductCategoryQuery, GetProductCategoryQueryVariables>(GetProductCategoryDocument, variables, options);
    },
    ListProductCategories(variables?: ListProductCategoriesQueryVariables, options?: C): Promise<ListProductCategoriesQuery> {
      return requester<ListProductCategoriesQuery, ListProductCategoriesQueryVariables>(ListProductCategoriesDocument, variables, options);
    },
    SearchProductCategories(variables?: SearchProductCategoriesQueryVariables, options?: C): Promise<SearchProductCategoriesQuery> {
      return requester<SearchProductCategoriesQuery, SearchProductCategoriesQueryVariables>(SearchProductCategoriesDocument, variables, options);
    },
    GetProductComponent(variables: GetProductComponentQueryVariables, options?: C): Promise<GetProductComponentQuery> {
      return requester<GetProductComponentQuery, GetProductComponentQueryVariables>(GetProductComponentDocument, variables, options);
    },
    ListProductComponents(variables?: ListProductComponentsQueryVariables, options?: C): Promise<ListProductComponentsQuery> {
      return requester<ListProductComponentsQuery, ListProductComponentsQueryVariables>(ListProductComponentsDocument, variables, options);
    },
    SearchProductComponents(variables?: SearchProductComponentsQueryVariables, options?: C): Promise<SearchProductComponentsQuery> {
      return requester<SearchProductComponentsQuery, SearchProductComponentsQueryVariables>(SearchProductComponentsDocument, variables, options);
    },
    GetProductComponentSet(variables: GetProductComponentSetQueryVariables, options?: C): Promise<GetProductComponentSetQuery> {
      return requester<GetProductComponentSetQuery, GetProductComponentSetQueryVariables>(GetProductComponentSetDocument, variables, options);
    },
    ListProductComponentSets(variables?: ListProductComponentSetsQueryVariables, options?: C): Promise<ListProductComponentSetsQuery> {
      return requester<ListProductComponentSetsQuery, ListProductComponentSetsQueryVariables>(ListProductComponentSetsDocument, variables, options);
    },
    SearchProductComponentSets(variables?: SearchProductComponentSetsQueryVariables, options?: C): Promise<SearchProductComponentSetsQuery> {
      return requester<SearchProductComponentSetsQuery, SearchProductComponentSetsQueryVariables>(SearchProductComponentSetsDocument, variables, options);
    },
    GetFavoriteProduct(variables: GetFavoriteProductQueryVariables, options?: C): Promise<GetFavoriteProductQuery> {
      return requester<GetFavoriteProductQuery, GetFavoriteProductQueryVariables>(GetFavoriteProductDocument, variables, options);
    },
    ListFavoriteProducts(variables?: ListFavoriteProductsQueryVariables, options?: C): Promise<ListFavoriteProductsQuery> {
      return requester<ListFavoriteProductsQuery, ListFavoriteProductsQueryVariables>(ListFavoriteProductsDocument, variables, options);
    },
    SearchFavoriteProducts(variables?: SearchFavoriteProductsQueryVariables, options?: C): Promise<SearchFavoriteProductsQuery> {
      return requester<SearchFavoriteProductsQuery, SearchFavoriteProductsQueryVariables>(SearchFavoriteProductsDocument, variables, options);
    },
    GetUnit(variables: GetUnitQueryVariables, options?: C): Promise<GetUnitQuery> {
      return requester<GetUnitQuery, GetUnitQueryVariables>(GetUnitDocument, variables, options);
    },
    ListUnits(variables?: ListUnitsQueryVariables, options?: C): Promise<ListUnitsQuery> {
      return requester<ListUnitsQuery, ListUnitsQueryVariables>(ListUnitsDocument, variables, options);
    },
    SearchUnits(variables?: SearchUnitsQueryVariables, options?: C): Promise<SearchUnitsQuery> {
      return requester<SearchUnitsQuery, SearchUnitsQueryVariables>(SearchUnitsDocument, variables, options);
    },
    GetUser(variables: GetUserQueryVariables, options?: C): Promise<GetUserQuery> {
      return requester<GetUserQuery, GetUserQueryVariables>(GetUserDocument, variables, options);
    },
    ListUsers(variables?: ListUsersQueryVariables, options?: C): Promise<ListUsersQuery> {
      return requester<ListUsersQuery, ListUsersQueryVariables>(ListUsersDocument, variables, options);
    },
    SearchUsers(variables?: SearchUsersQueryVariables, options?: C): Promise<SearchUsersQuery> {
      return requester<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, variables, options);
    },
    GetCart(variables: GetCartQueryVariables, options?: C): Promise<GetCartQuery> {
      return requester<GetCartQuery, GetCartQueryVariables>(GetCartDocument, variables, options);
    },
    ListCarts(variables?: ListCartsQueryVariables, options?: C): Promise<ListCartsQuery> {
      return requester<ListCartsQuery, ListCartsQueryVariables>(ListCartsDocument, variables, options);
    },
    SearchCarts(variables?: SearchCartsQueryVariables, options?: C): Promise<SearchCartsQuery> {
      return requester<SearchCartsQuery, SearchCartsQueryVariables>(SearchCartsDocument, variables, options);
    },
    GetTransaction(variables: GetTransactionQueryVariables, options?: C): Promise<GetTransactionQuery> {
      return requester<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, variables, options);
    },
    ListTransactions(variables?: ListTransactionsQueryVariables, options?: C): Promise<ListTransactionsQuery> {
      return requester<ListTransactionsQuery, ListTransactionsQueryVariables>(ListTransactionsDocument, variables, options);
    },
    SearchTransactions(variables?: SearchTransactionsQueryVariables, options?: C): Promise<SearchTransactionsQuery> {
      return requester<SearchTransactionsQuery, SearchTransactionsQueryVariables>(SearchTransactionsDocument, variables, options);
    },
    GetInvoice(variables: GetInvoiceQueryVariables, options?: C): Promise<GetInvoiceQuery> {
      return requester<GetInvoiceQuery, GetInvoiceQueryVariables>(GetInvoiceDocument, variables, options);
    },
    ListInvoices(variables?: ListInvoicesQueryVariables, options?: C): Promise<ListInvoicesQuery> {
      return requester<ListInvoicesQuery, ListInvoicesQueryVariables>(ListInvoicesDocument, variables, options);
    },
    SearchInvoices(variables?: SearchInvoicesQueryVariables, options?: C): Promise<SearchInvoicesQuery> {
      return requester<SearchInvoicesQuery, SearchInvoicesQueryVariables>(SearchInvoicesDocument, variables, options);
    },
    GetReceipt(variables: GetReceiptQueryVariables, options?: C): Promise<GetReceiptQuery> {
      return requester<GetReceiptQuery, GetReceiptQueryVariables>(GetReceiptDocument, variables, options);
    },
    ListReceipts(variables?: ListReceiptsQueryVariables, options?: C): Promise<ListReceiptsQuery> {
      return requester<ListReceiptsQuery, ListReceiptsQueryVariables>(ListReceiptsDocument, variables, options);
    },
    SearchReceipts(variables?: SearchReceiptsQueryVariables, options?: C): Promise<SearchReceiptsQuery> {
      return requester<SearchReceiptsQuery, SearchReceiptsQueryVariables>(SearchReceiptsDocument, variables, options);
    },
    OnAdminUserChange(variables: OnAdminUserChangeSubscriptionVariables, options?: C): Observable<OnAdminUserChangeSubscription> {
      return requester<OnAdminUserChangeSubscription, OnAdminUserChangeSubscriptionVariables>(OnAdminUserChangeDocument, variables, options);
    },
    OnAdminUsersChange(variables?: OnAdminUsersChangeSubscriptionVariables, options?: C): Observable<OnAdminUsersChangeSubscription> {
      return requester<OnAdminUsersChangeSubscription, OnAdminUsersChangeSubscriptionVariables>(OnAdminUsersChangeDocument, variables, options);
    },
    OnProductCategoriesChange(variables: OnProductCategoriesChangeSubscriptionVariables, options?: C): Observable<OnProductCategoriesChangeSubscription> {
      return requester<OnProductCategoriesChangeSubscription, OnProductCategoriesChangeSubscriptionVariables>(OnProductCategoriesChangeDocument, variables, options);
    },
    OnProductComponentsChange(variables: OnProductComponentsChangeSubscriptionVariables, options?: C): Observable<OnProductComponentsChangeSubscription> {
      return requester<OnProductComponentsChangeSubscription, OnProductComponentsChangeSubscriptionVariables>(OnProductComponentsChangeDocument, variables, options);
    },
    OnProductComponentSetsChange(variables: OnProductComponentSetsChangeSubscriptionVariables, options?: C): Observable<OnProductComponentSetsChangeSubscription> {
      return requester<OnProductComponentSetsChangeSubscription, OnProductComponentSetsChangeSubscriptionVariables>(OnProductComponentSetsChangeDocument, variables, options);
    },
    OnUnitProductChange(variables: OnUnitProductChangeSubscriptionVariables, options?: C): Observable<OnUnitProductChangeSubscription> {
      return requester<OnUnitProductChangeSubscription, OnUnitProductChangeSubscriptionVariables>(OnUnitProductChangeDocument, variables, options);
    },
    OnOrdersChange(variables?: OnOrdersChangeSubscriptionVariables, options?: C): Observable<OnOrdersChangeSubscription> {
      return requester<OnOrdersChangeSubscription, OnOrdersChangeSubscriptionVariables>(OnOrdersChangeDocument, variables, options);
    },
    OnOrdersDelete(variables?: OnOrdersDeleteSubscriptionVariables, options?: C): Observable<OnOrdersDeleteSubscription> {
      return requester<OnOrdersDeleteSubscription, OnOrdersDeleteSubscriptionVariables>(OnOrdersDeleteDocument, variables, options);
    },
    OnOrderChanged(variables?: OnOrderChangedSubscriptionVariables, options?: C): Observable<OnOrderChangedSubscription> {
      return requester<OnOrderChangedSubscription, OnOrderChangedSubscriptionVariables>(OnOrderChangedDocument, variables, options);
    },
    OnUnitOrdersChange(variables?: OnUnitOrdersChangeSubscriptionVariables, options?: C): Observable<OnUnitOrdersChangeSubscription> {
      return requester<OnUnitOrdersChangeSubscription, OnUnitOrdersChangeSubscriptionVariables>(OnUnitOrdersChangeDocument, variables, options);
    },
    OnCreateUnitProduct(variables?: OnCreateUnitProductSubscriptionVariables, options?: C): Observable<OnCreateUnitProductSubscription> {
      return requester<OnCreateUnitProductSubscription, OnCreateUnitProductSubscriptionVariables>(OnCreateUnitProductDocument, variables, options);
    },
    OnUpdateUnitProduct(variables?: OnUpdateUnitProductSubscriptionVariables, options?: C): Observable<OnUpdateUnitProductSubscription> {
      return requester<OnUpdateUnitProductSubscription, OnUpdateUnitProductSubscriptionVariables>(OnUpdateUnitProductDocument, variables, options);
    },
    OnDeleteUnitProduct(variables?: OnDeleteUnitProductSubscriptionVariables, options?: C): Observable<OnDeleteUnitProductSubscription> {
      return requester<OnDeleteUnitProductSubscription, OnDeleteUnitProductSubscriptionVariables>(OnDeleteUnitProductDocument, variables, options);
    },
    OnCreateVariant(variables?: OnCreateVariantSubscriptionVariables, options?: C): Observable<OnCreateVariantSubscription> {
      return requester<OnCreateVariantSubscription, OnCreateVariantSubscriptionVariables>(OnCreateVariantDocument, variables, options);
    },
    OnUpdateVariant(variables?: OnUpdateVariantSubscriptionVariables, options?: C): Observable<OnUpdateVariantSubscription> {
      return requester<OnUpdateVariantSubscription, OnUpdateVariantSubscriptionVariables>(OnUpdateVariantDocument, variables, options);
    },
    OnDeleteVariant(variables?: OnDeleteVariantSubscriptionVariables, options?: C): Observable<OnDeleteVariantSubscription> {
      return requester<OnDeleteVariantSubscription, OnDeleteVariantSubscriptionVariables>(OnDeleteVariantDocument, variables, options);
    },
    OnUpdateAdminUser(variables?: OnUpdateAdminUserSubscriptionVariables, options?: C): Observable<OnUpdateAdminUserSubscription> {
      return requester<OnUpdateAdminUserSubscription, OnUpdateAdminUserSubscriptionVariables>(OnUpdateAdminUserDocument, variables, options);
    },
    OnUpdateOrder(variables?: OnUpdateOrderSubscriptionVariables, options?: C): Observable<OnUpdateOrderSubscription> {
      return requester<OnUpdateOrderSubscription, OnUpdateOrderSubscriptionVariables>(OnUpdateOrderDocument, variables, options);
    },
    OnDeleteOrder(variables?: OnDeleteOrderSubscriptionVariables, options?: C): Observable<OnDeleteOrderSubscription> {
      return requester<OnDeleteOrderSubscription, OnDeleteOrderSubscriptionVariables>(OnDeleteOrderDocument, variables, options);
    },
    OnCreateProductCategory(variables?: OnCreateProductCategorySubscriptionVariables, options?: C): Observable<OnCreateProductCategorySubscription> {
      return requester<OnCreateProductCategorySubscription, OnCreateProductCategorySubscriptionVariables>(OnCreateProductCategoryDocument, variables, options);
    },
    OnUpdateProductCategory(variables?: OnUpdateProductCategorySubscriptionVariables, options?: C): Observable<OnUpdateProductCategorySubscription> {
      return requester<OnUpdateProductCategorySubscription, OnUpdateProductCategorySubscriptionVariables>(OnUpdateProductCategoryDocument, variables, options);
    },
    OnDeleteProductCategory(variables?: OnDeleteProductCategorySubscriptionVariables, options?: C): Observable<OnDeleteProductCategorySubscription> {
      return requester<OnDeleteProductCategorySubscription, OnDeleteProductCategorySubscriptionVariables>(OnDeleteProductCategoryDocument, variables, options);
    },
    OnCreateProductComponent(variables?: OnCreateProductComponentSubscriptionVariables, options?: C): Observable<OnCreateProductComponentSubscription> {
      return requester<OnCreateProductComponentSubscription, OnCreateProductComponentSubscriptionVariables>(OnCreateProductComponentDocument, variables, options);
    },
    OnUpdateProductComponent(variables?: OnUpdateProductComponentSubscriptionVariables, options?: C): Observable<OnUpdateProductComponentSubscription> {
      return requester<OnUpdateProductComponentSubscription, OnUpdateProductComponentSubscriptionVariables>(OnUpdateProductComponentDocument, variables, options);
    },
    OnDeleteProductComponent(variables?: OnDeleteProductComponentSubscriptionVariables, options?: C): Observable<OnDeleteProductComponentSubscription> {
      return requester<OnDeleteProductComponentSubscription, OnDeleteProductComponentSubscriptionVariables>(OnDeleteProductComponentDocument, variables, options);
    },
    OnCreateProductComponentSet(variables?: OnCreateProductComponentSetSubscriptionVariables, options?: C): Observable<OnCreateProductComponentSetSubscription> {
      return requester<OnCreateProductComponentSetSubscription, OnCreateProductComponentSetSubscriptionVariables>(OnCreateProductComponentSetDocument, variables, options);
    },
    OnUpdateProductComponentSet(variables?: OnUpdateProductComponentSetSubscriptionVariables, options?: C): Observable<OnUpdateProductComponentSetSubscription> {
      return requester<OnUpdateProductComponentSetSubscription, OnUpdateProductComponentSetSubscriptionVariables>(OnUpdateProductComponentSetDocument, variables, options);
    },
    OnDeleteProductComponentSet(variables?: OnDeleteProductComponentSetSubscriptionVariables, options?: C): Observable<OnDeleteProductComponentSetSubscription> {
      return requester<OnDeleteProductComponentSetSubscription, OnDeleteProductComponentSetSubscriptionVariables>(OnDeleteProductComponentSetDocument, variables, options);
    },
    OnCreateFavoriteProduct(variables?: OnCreateFavoriteProductSubscriptionVariables, options?: C): Observable<OnCreateFavoriteProductSubscription> {
      return requester<OnCreateFavoriteProductSubscription, OnCreateFavoriteProductSubscriptionVariables>(OnCreateFavoriteProductDocument, variables, options);
    },
    OnUpdateFavoriteProduct(variables?: OnUpdateFavoriteProductSubscriptionVariables, options?: C): Observable<OnUpdateFavoriteProductSubscription> {
      return requester<OnUpdateFavoriteProductSubscription, OnUpdateFavoriteProductSubscriptionVariables>(OnUpdateFavoriteProductDocument, variables, options);
    },
    OnDeleteFavoriteProduct(variables?: OnDeleteFavoriteProductSubscriptionVariables, options?: C): Observable<OnDeleteFavoriteProductSubscription> {
      return requester<OnDeleteFavoriteProductSubscription, OnDeleteFavoriteProductSubscriptionVariables>(OnDeleteFavoriteProductDocument, variables, options);
    },
    OnDeleteUnit(variables?: OnDeleteUnitSubscriptionVariables, options?: C): Observable<OnDeleteUnitSubscription> {
      return requester<OnDeleteUnitSubscription, OnDeleteUnitSubscriptionVariables>(OnDeleteUnitDocument, variables, options);
    },
    OnCreateUser(variables?: OnCreateUserSubscriptionVariables, options?: C): Observable<OnCreateUserSubscription> {
      return requester<OnCreateUserSubscription, OnCreateUserSubscriptionVariables>(OnCreateUserDocument, variables, options);
    },
    OnUpdateUser(variables?: OnUpdateUserSubscriptionVariables, options?: C): Observable<OnUpdateUserSubscription> {
      return requester<OnUpdateUserSubscription, OnUpdateUserSubscriptionVariables>(OnUpdateUserDocument, variables, options);
    },
    OnDeleteUser(variables?: OnDeleteUserSubscriptionVariables, options?: C): Observable<OnDeleteUserSubscription> {
      return requester<OnDeleteUserSubscription, OnDeleteUserSubscriptionVariables>(OnDeleteUserDocument, variables, options);
    },
    OnCreateCart(variables?: OnCreateCartSubscriptionVariables, options?: C): Observable<OnCreateCartSubscription> {
      return requester<OnCreateCartSubscription, OnCreateCartSubscriptionVariables>(OnCreateCartDocument, variables, options);
    },
    OnUpdateCart(variables?: OnUpdateCartSubscriptionVariables, options?: C): Observable<OnUpdateCartSubscription> {
      return requester<OnUpdateCartSubscription, OnUpdateCartSubscriptionVariables>(OnUpdateCartDocument, variables, options);
    },
    OnDeleteCart(variables?: OnDeleteCartSubscriptionVariables, options?: C): Observable<OnDeleteCartSubscription> {
      return requester<OnDeleteCartSubscription, OnDeleteCartSubscriptionVariables>(OnDeleteCartDocument, variables, options);
    },
    OnCreateTransaction(variables?: OnCreateTransactionSubscriptionVariables, options?: C): Observable<OnCreateTransactionSubscription> {
      return requester<OnCreateTransactionSubscription, OnCreateTransactionSubscriptionVariables>(OnCreateTransactionDocument, variables, options);
    },
    OnUpdateTransaction(variables?: OnUpdateTransactionSubscriptionVariables, options?: C): Observable<OnUpdateTransactionSubscription> {
      return requester<OnUpdateTransactionSubscription, OnUpdateTransactionSubscriptionVariables>(OnUpdateTransactionDocument, variables, options);
    },
    OnDeleteTransaction(variables?: OnDeleteTransactionSubscriptionVariables, options?: C): Observable<OnDeleteTransactionSubscription> {
      return requester<OnDeleteTransactionSubscription, OnDeleteTransactionSubscriptionVariables>(OnDeleteTransactionDocument, variables, options);
    },
    OnCreateInvoice(variables?: OnCreateInvoiceSubscriptionVariables, options?: C): Observable<OnCreateInvoiceSubscription> {
      return requester<OnCreateInvoiceSubscription, OnCreateInvoiceSubscriptionVariables>(OnCreateInvoiceDocument, variables, options);
    },
    OnUpdateInvoice(variables?: OnUpdateInvoiceSubscriptionVariables, options?: C): Observable<OnUpdateInvoiceSubscription> {
      return requester<OnUpdateInvoiceSubscription, OnUpdateInvoiceSubscriptionVariables>(OnUpdateInvoiceDocument, variables, options);
    },
    OnDeleteInvoice(variables?: OnDeleteInvoiceSubscriptionVariables, options?: C): Observable<OnDeleteInvoiceSubscription> {
      return requester<OnDeleteInvoiceSubscription, OnDeleteInvoiceSubscriptionVariables>(OnDeleteInvoiceDocument, variables, options);
    },
    OnCreateReceipt(variables?: OnCreateReceiptSubscriptionVariables, options?: C): Observable<OnCreateReceiptSubscription> {
      return requester<OnCreateReceiptSubscription, OnCreateReceiptSubscriptionVariables>(OnCreateReceiptDocument, variables, options);
    },
    OnUpdateReceipt(variables?: OnUpdateReceiptSubscriptionVariables, options?: C): Observable<OnUpdateReceiptSubscription> {
      return requester<OnUpdateReceiptSubscription, OnUpdateReceiptSubscriptionVariables>(OnUpdateReceiptDocument, variables, options);
    },
    OnDeleteReceipt(variables?: OnDeleteReceiptSubscriptionVariables, options?: C): Observable<OnDeleteReceiptSubscription> {
      return requester<OnDeleteReceiptSubscription, OnDeleteReceiptSubscriptionVariables>(OnDeleteReceiptDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;