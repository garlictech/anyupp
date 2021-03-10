/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAdminUserInput = {
  id?: string | null,
  name?: string | null,
  profileImage?: string | null,
  roles: AdminUserRoleInput,
  settings?: AdminUserSettingsInput | null,
  email?: string | null,
  phone?: string | null,
};

export type AdminUserRoleInput = {
  role: string,
  entities?: Array< AdminRoleEntityInput | null > | null,
};

export type AdminRoleEntityInput = {
  chainId?: string | null,
  groupId?: string | null,
  unitId?: string | null,
};

export type AdminUserSettingsInput = {
  selectedChainId?: string | null,
  selectedGroupId?: string | null,
  selectedUnitId?: string | null,
  selectedProductCategoryId?: string | null,
  selectedLanguage?: string | null,
  selectedHistoryDate?: number | null,
};

export type ModelAdminUserConditionInput = {
  name?: ModelStringInput | null,
  profileImage?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelAdminUserConditionInput | null > | null,
  or?: Array< ModelAdminUserConditionInput | null > | null,
  not?: ModelAdminUserConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type AdminUser = {
  __typename: "AdminUser",
  id?: string,
  name?: string | null,
  profileImage?: string | null,
  roles?: AdminUserRole,
  settings?: AdminUserSettings,
  email?: string | null,
  phone?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type AdminUserRole = {
  __typename: "AdminUserRole",
  role?: string,
  entities?:  Array<AdminRoleEntity | null > | null,
};

export type AdminRoleEntity = {
  __typename: "AdminRoleEntity",
  chainId?: string | null,
  groupId?: string | null,
  unitId?: string | null,
};

export type AdminUserSettings = {
  __typename: "AdminUserSettings",
  selectedChainId?: string | null,
  selectedGroupId?: string | null,
  selectedUnitId?: string | null,
  selectedProductCategoryId?: string | null,
  selectedLanguage?: string | null,
  selectedHistoryDate?: number | null,
};

export type UpdateAdminUserInput = {
  id: string,
  name?: string | null,
  profileImage?: string | null,
  roles?: AdminUserRoleInput | null,
  settings?: AdminUserSettingsInput | null,
  email?: string | null,
  phone?: string | null,
};

export type DeleteAdminUserInput = {
  id?: string | null,
};

export type CreateStripeCardInput = {
  brand?: CardBrand | null,
  checks?: CardChecksInput | null,
  country?: string | null,
  last4?: string | null,
  exp_month?: number | null,
  exp_year?: number | null,
  fingerprint?: string | null,
  funding?: CardFundingType | null,
  three_d_secure?: string | null,
  id?: string | null,
  object: string,
  metadata: Array< StripeMetadataInput >,
};

export enum CardBrand {
  amex = "amex",
  diners = "diners",
  discover = "discover",
  jcb = "jcb",
  mastercard = "mastercard",
  unionpay = "unionpay",
  visa = "visa",
  unknown = "unknown",
}


export type CardChecksInput = {
  address_line1_check?: string | null,
  address_postal_code_check?: string | null,
  cvc_check?: string | null,
};

export enum CardFundingType {
  credit = "credit",
  debit = "debit",
  prepaid = "prepaid",
  unknown = "unknown",
}


export type StripeMetadataInput = {
  key: string,
  value: string,
};

export type ModelStripeCardConditionInput = {
  brand?: ModelCardBrandInput | null,
  country?: ModelStringInput | null,
  last4?: ModelStringInput | null,
  exp_month?: ModelIntInput | null,
  exp_year?: ModelIntInput | null,
  fingerprint?: ModelStringInput | null,
  funding?: ModelCardFundingTypeInput | null,
  three_d_secure?: ModelStringInput | null,
  object?: ModelStringInput | null,
  and?: Array< ModelStripeCardConditionInput | null > | null,
  or?: Array< ModelStripeCardConditionInput | null > | null,
  not?: ModelStripeCardConditionInput | null,
};

export type ModelCardBrandInput = {
  eq?: CardBrand | null,
  ne?: CardBrand | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelCardFundingTypeInput = {
  eq?: CardFundingType | null,
  ne?: CardFundingType | null,
};

export type StripeCard = {
  __typename: "StripeCard",
  brand?: CardBrand | null,
  checks?: CardChecks,
  country?: string | null,
  last4?: string | null,
  exp_month?: number | null,
  exp_year?: number | null,
  fingerprint?: string | null,
  funding?: CardFundingType | null,
  three_d_secure?: string | null,
  id?: string,
  object?: string,
  metadata?:  Array<StripeMetadata >,
  createdAt?: string,
  updatedAt?: string,
};

export type CardChecks = {
  __typename: "CardChecks",
  address_line1_check?: string | null,
  address_postal_code_check?: string | null,
  cvc_check?: string | null,
};

export type StripeMetadata = {
  __typename: "StripeMetadata",
  key?: string,
  value?: string,
};

export type UpdateStripeCardInput = {
  brand?: CardBrand | null,
  checks?: CardChecksInput | null,
  country?: string | null,
  last4?: string | null,
  exp_month?: number | null,
  exp_year?: number | null,
  fingerprint?: string | null,
  funding?: CardFundingType | null,
  three_d_secure?: string | null,
  id: string,
  object?: string | null,
  metadata?: Array< StripeMetadataInput > | null,
};

export type DeleteStripeCardInput = {
  id?: string | null,
};

export type CreateChainInput = {
  id?: string | null,
  name?: string | null,
  description?: LocalizedItemInput | null,
  style?: ChainStyleInput | null,
  isActive?: boolean | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
};

export type LocalizedItemInput = {
  en?: string | null,
  de?: string | null,
  hu?: string | null,
};

export type ChainStyleInput = {
  colors?: ChainStyleColorsInput | null,
  images?: ChainStyleImagesInput | null,
};

export type ChainStyleColorsInput = {
  backgroundLight?: string | null,
  backgroundDark?: string | null,
  borderLight?: string | null,
  borderDark?: string | null,
  disabled?: string | null,
  highlight?: string | null,
  indicator?: string | null,
  textLight?: string | null,
  textDark?: string | null,
};

export type ChainStyleImagesInput = {
  header?: string | null,
  logo?: string | null,
};

export type AddressInput = {
  address?: string | null,
  city?: string | null,
  country?: string | null,
  title?: string | null,
  postalCode?: string | null,
  location?: LocationInput | null,
};

export type LocationInput = {
  lat?: string | null,
  lng?: string | null,
};

export type ModelChainConditionInput = {
  name?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelChainConditionInput | null > | null,
  or?: Array< ModelChainConditionInput | null > | null,
  not?: ModelChainConditionInput | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Chain = {
  __typename: "Chain",
  id?: string,
  name?: string | null,
  description?: LocalizedItem,
  style?: ChainStyle,
  isActive?: boolean | null,
  address?: Address,
  email?: string | null,
  phone?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type LocalizedItem = {
  __typename: "LocalizedItem",
  en?: string | null,
  de?: string | null,
  hu?: string | null,
};

export type ChainStyle = {
  __typename: "ChainStyle",
  colors?: ChainStyleColors,
  images?: ChainStyleImages,
};

export type ChainStyleColors = {
  __typename: "ChainStyleColors",
  backgroundLight?: string | null,
  backgroundDark?: string | null,
  borderLight?: string | null,
  borderDark?: string | null,
  disabled?: string | null,
  highlight?: string | null,
  indicator?: string | null,
  textLight?: string | null,
  textDark?: string | null,
};

export type ChainStyleImages = {
  __typename: "ChainStyleImages",
  header?: string | null,
  logo?: string | null,
};

export type Address = {
  __typename: "Address",
  address?: string | null,
  city?: string | null,
  country?: string | null,
  title?: string | null,
  postalCode?: string | null,
  location?: Location,
};

export type Location = {
  __typename: "Location",
  lat?: string | null,
  lng?: string | null,
};

export type UpdateChainInput = {
  id: string,
  name?: string | null,
  description?: LocalizedItemInput | null,
  style?: ChainStyleInput | null,
  isActive?: boolean | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
};

export type DeleteChainInput = {
  id?: string | null,
};

export type CreateGroupInput = {
  id?: string | null,
  chainId: string,
  name?: string | null,
  description?: LocalizedItemInput | null,
  currency?: string | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
};

export type ModelGroupConditionInput = {
  chainId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelGroupConditionInput | null > | null,
  or?: Array< ModelGroupConditionInput | null > | null,
  not?: ModelGroupConditionInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Group = {
  __typename: "Group",
  id?: string,
  chainId?: string,
  name?: string | null,
  description?: LocalizedItem,
  currency?: string | null,
  address?: Address,
  email?: string | null,
  phone?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateGroupInput = {
  id: string,
  chainId?: string | null,
  name?: string | null,
  description?: LocalizedItemInput | null,
  currency?: string | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
};

export type DeleteGroupInput = {
  id?: string | null,
};

export type CreateOrderInput = {
  id?: string | null,
  created?: number | null,
  items?: Array< OrderItemInput | null > | null,
  paymentMethod?: string | null,
  staffId?: string | null,
  statusLog?: Array< StatusLogInput | null > | null,
  sumPriceShown?: PriceShownInput | null,
  takeAway?: boolean | null,
  userId?: string | null,
  place?: PlaceInput | null,
  paymentIntention?: number | null,
};

export type OrderItemInput = {
  created?: number | null,
  productName?: LocalizedItemInput | null,
  priceShown?: PriceShownInput | null,
  productId?: string | null,
  quantity?: number | null,
  statusLog?: Array< StatusLogInput | null > | null,
  variantId?: string | null,
  variantName?: LocalizedItemInput | null,
  laneId?: string | null,
};

export type PriceShownInput = {
  currency?: string | null,
  pricePerUnit?: number | null,
  priceSum?: number | null,
  tax?: number | null,
  taxSum?: number | null,
};

export type StatusLogInput = {
  userId?: string | null,
  status?: string | null,
  ts?: number | null,
};

export type PlaceInput = {
  seat?: string | null,
  table?: string | null,
};

export type ModelOrderConditionInput = {
  created?: ModelIntInput | null,
  paymentMethod?: ModelStringInput | null,
  staffId?: ModelIDInput | null,
  takeAway?: ModelBooleanInput | null,
  userId?: ModelIDInput | null,
  paymentIntention?: ModelIntInput | null,
  and?: Array< ModelOrderConditionInput | null > | null,
  or?: Array< ModelOrderConditionInput | null > | null,
  not?: ModelOrderConditionInput | null,
};

export type Order = {
  __typename: "Order",
  id?: string,
  created?: number | null,
  items?:  Array<OrderItem | null > | null,
  paymentMethod?: string | null,
  staffId?: string | null,
  statusLog?:  Array<StatusLog | null > | null,
  sumPriceShown?: PriceShown,
  takeAway?: boolean | null,
  userId?: string | null,
  place?: Place,
  paymentIntention?: number | null,
  createdAt?: string,
  updatedAt?: string,
};

export type OrderItem = {
  __typename: "OrderItem",
  created?: number | null,
  productName?: LocalizedItem,
  priceShown?: PriceShown,
  productId?: string | null,
  quantity?: number | null,
  statusLog?:  Array<StatusLog | null > | null,
  variantId?: string | null,
  variantName?: LocalizedItem,
  laneId?: string | null,
};

export type PriceShown = {
  __typename: "PriceShown",
  currency?: string | null,
  pricePerUnit?: number | null,
  priceSum?: number | null,
  tax?: number | null,
  taxSum?: number | null,
};

export type StatusLog = {
  __typename: "StatusLog",
  userId?: string | null,
  status?: string | null,
  ts?: number | null,
};

export type Place = {
  __typename: "Place",
  seat?: string | null,
  table?: string | null,
};

export type UpdateOrderInput = {
  id: string,
  created?: number | null,
  items?: Array< OrderItemInput | null > | null,
  paymentMethod?: string | null,
  staffId?: string | null,
  statusLog?: Array< StatusLogInput | null > | null,
  sumPriceShown?: PriceShownInput | null,
  takeAway?: boolean | null,
  userId?: string | null,
  place?: PlaceInput | null,
  paymentIntention?: number | null,
};

export type DeleteOrderInput = {
  id?: string | null,
};

export type CreateProductCategoryInput = {
  id?: string | null,
  chainId: string,
  description?: LocalizedItemInput | null,
  image?: string | null,
  name?: LocalizedItemInput | null,
  position?: string | null,
};

export type ModelProductCategoryConditionInput = {
  chainId?: ModelIDInput | null,
  image?: ModelStringInput | null,
  position?: ModelStringInput | null,
  and?: Array< ModelProductCategoryConditionInput | null > | null,
  or?: Array< ModelProductCategoryConditionInput | null > | null,
  not?: ModelProductCategoryConditionInput | null,
};

export type ProductCategory = {
  __typename: "ProductCategory",
  id?: string,
  chainId?: string,
  description?: LocalizedItem,
  image?: string | null,
  name?: LocalizedItem,
  position?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateProductCategoryInput = {
  id: string,
  chainId?: string | null,
  description?: LocalizedItemInput | null,
  image?: string | null,
  name?: LocalizedItemInput | null,
  position?: string | null,
};

export type DeleteProductCategoryInput = {
  id?: string | null,
};

export type CreateChainProductInput = {
  id?: string | null,
  chainId: string,
  name?: LocalizedItemInput | null,
  description?: LocalizedItemInput | null,
  productCategoryId?: string | null,
  productType?: string | null,
  isVisible?: boolean | null,
  position?: string | null,
  image?: string | null,
  variants?: Array< ProductVariantInput | null > | null,
};

export type ProductVariantInput = {
  id: string,
  variantName?: LocalizedItemInput | null,
  pack?: ProductVariantPackInput | null,
  refGroupPrice?: number | null,
  isAvailable?: boolean | null,
  price?: number | null,
  availabilities?: Array< AvailabilityInput | null > | null,
  position?: string | null,
};

export type ProductVariantPackInput = {
  size?: number | null,
  unit?: string | null,
};

export type AvailabilityInput = {
  type?: string | null,
  dayFrom?: string | null,
  dayTo?: string | null,
  timeFrom?: string | null,
  timeTo?: string | null,
  price?: number | null,
};

export type ModelChainProductConditionInput = {
  chainId?: ModelIDInput | null,
  productCategoryId?: ModelIDInput | null,
  productType?: ModelStringInput | null,
  isVisible?: ModelBooleanInput | null,
  position?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelChainProductConditionInput | null > | null,
  or?: Array< ModelChainProductConditionInput | null > | null,
  not?: ModelChainProductConditionInput | null,
};

export type ChainProduct = {
  __typename: "ChainProduct",
  id?: string,
  chainId?: string,
  name?: LocalizedItem,
  description?: LocalizedItem,
  productCategoryId?: string | null,
  productType?: string | null,
  isVisible?: boolean | null,
  position?: string | null,
  image?: string | null,
  variants?:  Array<ProductVariant | null > | null,
  createdAt?: string,
  updatedAt?: string,
};

export type ProductVariant = {
  __typename: "ProductVariant",
  id?: string,
  variantName?: LocalizedItem,
  pack?: ProductVariantPack,
  refGroupPrice?: number | null,
  isAvailable?: boolean | null,
  price?: number | null,
  availabilities?:  Array<Availability | null > | null,
  position?: string | null,
};

export type ProductVariantPack = {
  __typename: "ProductVariantPack",
  size?: number | null,
  unit?: string | null,
};

export type Availability = {
  __typename: "Availability",
  type?: string | null,
  dayFrom?: string | null,
  dayTo?: string | null,
  timeFrom?: string | null,
  timeTo?: string | null,
  price?: number | null,
};

export type UpdateChainProductInput = {
  id: string,
  chainId?: string | null,
  name?: LocalizedItemInput | null,
  description?: LocalizedItemInput | null,
  productCategoryId?: string | null,
  productType?: string | null,
  isVisible?: boolean | null,
  position?: string | null,
  image?: string | null,
  variants?: Array< ProductVariantInput | null > | null,
};

export type DeleteChainProductInput = {
  id?: string | null,
};

export type CreateUnitInput = {
  id?: string | null,
  groupId: string,
  chainId: string,
  isActive?: boolean | null,
  isAcceptingOrders?: boolean | null,
  name?: string | null,
  description?: LocalizedItemInput | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
  paymentModes?: Array< PaymentModeInput | null > | null,
  floorMap?: FloorMapDataInput | null,
  lanes?: Array< LaneInput | null > | null,
  open?: DailyScheduleInput | null,
  openingHours?: WeeklyScheduleInput | null,
};

export type PaymentModeInput = {
  name: string,
  caption?: string | null,
  method: string,
};

export type FloorMapDataInput = {
  w?: number | null,
  h?: number | null,
  objects?: Array< FloorMapDataObjectInput | null > | null,
};

export type FloorMapDataObjectInput = {
  id: string,
  t: string,
  c?: string | null,
  w?: number | null,
  h?: number | null,
  r?: number | null,
  a?: number | null,
  x: number,
  y: number,
  tID?: string | null,
  sID?: string | null,
};

export type LaneInput = {
  id?: string | null,
  name?: string | null,
  color?: string | null,
};

export type DailyScheduleInput = {
  from?: string | null,
  to?: string | null,
};

export type WeeklyScheduleInput = {
  mon?: DailyScheduleInput | null,
  tue?: DailyScheduleInput | null,
  wed?: DailyScheduleInput | null,
  thu?: DailyScheduleInput | null,
  fri?: DailyScheduleInput | null,
  sat?: DailyScheduleInput | null,
  sun?: DailyScheduleInput | null,
  override?: Array< CustomDailyScheduleInput | null > | null,
};

export type CustomDailyScheduleInput = {
  date?: string | null,
  from?: string | null,
  to?: string | null,
};

export type ModelUnitConditionInput = {
  groupId?: ModelIDInput | null,
  chainId?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  isAcceptingOrders?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelUnitConditionInput | null > | null,
  or?: Array< ModelUnitConditionInput | null > | null,
  not?: ModelUnitConditionInput | null,
};

export type Unit = {
  __typename: "Unit",
  id?: string,
  groupId?: string,
  chainId?: string,
  isActive?: boolean | null,
  isAcceptingOrders?: boolean | null,
  name?: string | null,
  description?: LocalizedItem,
  address?: Address,
  email?: string | null,
  phone?: string | null,
  paymentModes?:  Array<PaymentMode | null > | null,
  floorMap?: FloorMapData,
  lanes?:  Array<Lane | null > | null,
  open?: DailySchedule,
  openingHours?: WeeklySchedule,
  createdAt?: string,
  updatedAt?: string,
};

export type PaymentMode = {
  __typename: "PaymentMode",
  name?: string,
  caption?: string | null,
  method?: string,
};

export type FloorMapData = {
  __typename: "FloorMapData",
  w?: number | null,
  h?: number | null,
  objects?:  Array<FloorMapDataObject | null > | null,
};

export type FloorMapDataObject = {
  __typename: "FloorMapDataObject",
  id?: string,
  t?: string,
  c?: string | null,
  w?: number | null,
  h?: number | null,
  r?: number | null,
  a?: number | null,
  x?: number,
  y?: number,
  tID?: string | null,
  sID?: string | null,
};

export type Lane = {
  __typename: "Lane",
  id?: string | null,
  name?: string | null,
  color?: string | null,
};

export type DailySchedule = {
  __typename: "DailySchedule",
  from?: string | null,
  to?: string | null,
};

export type WeeklySchedule = {
  __typename: "WeeklySchedule",
  mon?: DailySchedule,
  tue?: DailySchedule,
  wed?: DailySchedule,
  thu?: DailySchedule,
  fri?: DailySchedule,
  sat?: DailySchedule,
  sun?: DailySchedule,
  override?:  Array<CustomDailySchedule | null > | null,
};

export type CustomDailySchedule = {
  __typename: "CustomDailySchedule",
  date?: string | null,
  from?: string | null,
  to?: string | null,
};

export type UpdateUnitInput = {
  id: string,
  groupId?: string | null,
  chainId?: string | null,
  isActive?: boolean | null,
  isAcceptingOrders?: boolean | null,
  name?: string | null,
  description?: LocalizedItemInput | null,
  address?: AddressInput | null,
  email?: string | null,
  phone?: string | null,
  paymentModes?: Array< PaymentModeInput | null > | null,
  floorMap?: FloorMapDataInput | null,
  lanes?: Array< LaneInput | null > | null,
  open?: DailyScheduleInput | null,
  openingHours?: WeeklyScheduleInput | null,
};

export type DeleteUnitInput = {
  id?: string | null,
};

export type CreateUserInput = {
  id?: string | null,
  name?: string | null,
  email?: string | null,
  phone?: string | null,
  profileImage?: string | null,
  login?: string | null,
};

export type ModelUserConditionInput = {
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  profileImage?: ModelStringInput | null,
  login?: ModelStringInput | null,
  and?: Array< ModelUserConditionInput | null > | null,
  or?: Array< ModelUserConditionInput | null > | null,
  not?: ModelUserConditionInput | null,
};

export type User = {
  __typename: "User",
  id?: string,
  name?: string | null,
  email?: string | null,
  phone?: string | null,
  profileImage?: string | null,
  login?: string | null,
  createdAt?: string,
  updatedAt?: string,
};

export type UpdateUserInput = {
  id: string,
  name?: string | null,
  email?: string | null,
  phone?: string | null,
  profileImage?: string | null,
  login?: string | null,
};

export type DeleteUserInput = {
  id?: string | null,
};

export type ModelAdminUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  profileImage?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelAdminUserFilterInput | null > | null,
  or?: Array< ModelAdminUserFilterInput | null > | null,
  not?: ModelAdminUserFilterInput | null,
};

export type ModelAdminUserConnection = {
  __typename: "ModelAdminUserConnection",
  items?:  Array<AdminUser | null > | null,
  nextToken?: string | null,
};

export type ModelStripeCardFilterInput = {
  brand?: ModelCardBrandInput | null,
  country?: ModelStringInput | null,
  last4?: ModelStringInput | null,
  exp_month?: ModelIntInput | null,
  exp_year?: ModelIntInput | null,
  fingerprint?: ModelStringInput | null,
  funding?: ModelCardFundingTypeInput | null,
  three_d_secure?: ModelStringInput | null,
  id?: ModelIDInput | null,
  object?: ModelStringInput | null,
  and?: Array< ModelStripeCardFilterInput | null > | null,
  or?: Array< ModelStripeCardFilterInput | null > | null,
  not?: ModelStripeCardFilterInput | null,
};

export type ModelStripeCardConnection = {
  __typename: "ModelStripeCardConnection",
  items?:  Array<StripeCard | null > | null,
  nextToken?: string | null,
};

export type ModelChainFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  isActive?: ModelBooleanInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelChainFilterInput | null > | null,
  or?: Array< ModelChainFilterInput | null > | null,
  not?: ModelChainFilterInput | null,
};

export type ModelChainConnection = {
  __typename: "ModelChainConnection",
  items?:  Array<Chain | null > | null,
  nextToken?: string | null,
};

export type ModelGroupFilterInput = {
  id?: ModelIDInput | null,
  chainId?: ModelIDInput | null,
  name?: ModelStringInput | null,
  currency?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelGroupFilterInput | null > | null,
  or?: Array< ModelGroupFilterInput | null > | null,
  not?: ModelGroupFilterInput | null,
};

export type ModelGroupConnection = {
  __typename: "ModelGroupConnection",
  items?:  Array<Group | null > | null,
  nextToken?: string | null,
};

export type ModelOrderFilterInput = {
  id?: ModelIDInput | null,
  created?: ModelIntInput | null,
  paymentMethod?: ModelStringInput | null,
  staffId?: ModelIDInput | null,
  takeAway?: ModelBooleanInput | null,
  userId?: ModelIDInput | null,
  paymentIntention?: ModelIntInput | null,
  and?: Array< ModelOrderFilterInput | null > | null,
  or?: Array< ModelOrderFilterInput | null > | null,
  not?: ModelOrderFilterInput | null,
};

export type ModelOrderConnection = {
  __typename: "ModelOrderConnection",
  items?:  Array<Order | null > | null,
  nextToken?: string | null,
};

export type ModelProductCategoryFilterInput = {
  id?: ModelIDInput | null,
  chainId?: ModelIDInput | null,
  image?: ModelStringInput | null,
  position?: ModelStringInput | null,
  and?: Array< ModelProductCategoryFilterInput | null > | null,
  or?: Array< ModelProductCategoryFilterInput | null > | null,
  not?: ModelProductCategoryFilterInput | null,
};

export type ModelProductCategoryConnection = {
  __typename: "ModelProductCategoryConnection",
  items?:  Array<ProductCategory | null > | null,
  nextToken?: string | null,
};

export type ModelChainProductFilterInput = {
  id?: ModelIDInput | null,
  chainId?: ModelIDInput | null,
  productCategoryId?: ModelIDInput | null,
  productType?: ModelStringInput | null,
  isVisible?: ModelBooleanInput | null,
  position?: ModelStringInput | null,
  image?: ModelStringInput | null,
  and?: Array< ModelChainProductFilterInput | null > | null,
  or?: Array< ModelChainProductFilterInput | null > | null,
  not?: ModelChainProductFilterInput | null,
};

export type ModelChainProductConnection = {
  __typename: "ModelChainProductConnection",
  items?:  Array<ChainProduct | null > | null,
  nextToken?: string | null,
};

export type ModelUnitFilterInput = {
  id?: ModelIDInput | null,
  groupId?: ModelIDInput | null,
  chainId?: ModelIDInput | null,
  isActive?: ModelBooleanInput | null,
  isAcceptingOrders?: ModelBooleanInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  and?: Array< ModelUnitFilterInput | null > | null,
  or?: Array< ModelUnitFilterInput | null > | null,
  not?: ModelUnitFilterInput | null,
};

export type ModelUnitConnection = {
  __typename: "ModelUnitConnection",
  items?:  Array<Unit | null > | null,
  nextToken?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDInput | null,
  name?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  profileImage?: ModelStringInput | null,
  login?: ModelStringInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelUserConnection = {
  __typename: "ModelUserConnection",
  items?:  Array<User | null > | null,
  nextToken?: string | null,
};

export type CreateAdminUserMutationVariables = {
  input?: CreateAdminUserInput,
  condition?: ModelAdminUserConditionInput | null,
};

export type CreateAdminUserMutation = {
  createAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAdminUserMutationVariables = {
  input?: UpdateAdminUserInput,
  condition?: ModelAdminUserConditionInput | null,
};

export type UpdateAdminUserMutation = {
  updateAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAdminUserMutationVariables = {
  input?: DeleteAdminUserInput,
  condition?: ModelAdminUserConditionInput | null,
};

export type DeleteAdminUserMutation = {
  deleteAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateStripeCardMutationVariables = {
  input?: CreateStripeCardInput,
  condition?: ModelStripeCardConditionInput | null,
};

export type CreateStripeCardMutation = {
  createStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateStripeCardMutationVariables = {
  input?: UpdateStripeCardInput,
  condition?: ModelStripeCardConditionInput | null,
};

export type UpdateStripeCardMutation = {
  updateStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteStripeCardMutationVariables = {
  input?: DeleteStripeCardInput,
  condition?: ModelStripeCardConditionInput | null,
};

export type DeleteStripeCardMutation = {
  deleteStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateChainMutationVariables = {
  input?: CreateChainInput,
  condition?: ModelChainConditionInput | null,
};

export type CreateChainMutation = {
  createChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateChainMutationVariables = {
  input?: UpdateChainInput,
  condition?: ModelChainConditionInput | null,
};

export type UpdateChainMutation = {
  updateChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteChainMutationVariables = {
  input?: DeleteChainInput,
  condition?: ModelChainConditionInput | null,
};

export type DeleteChainMutation = {
  deleteChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateGroupMutationVariables = {
  input?: CreateGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type CreateGroupMutation = {
  createGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateGroupMutationVariables = {
  input?: UpdateGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type UpdateGroupMutation = {
  updateGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteGroupMutationVariables = {
  input?: DeleteGroupInput,
  condition?: ModelGroupConditionInput | null,
};

export type DeleteGroupMutation = {
  deleteGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateOrderMutationVariables = {
  input?: CreateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type CreateOrderMutation = {
  createOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateOrderMutationVariables = {
  input?: UpdateOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type UpdateOrderMutation = {
  updateOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteOrderMutationVariables = {
  input?: DeleteOrderInput,
  condition?: ModelOrderConditionInput | null,
};

export type DeleteOrderMutation = {
  deleteOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateProductCategoryMutationVariables = {
  input?: CreateProductCategoryInput,
  condition?: ModelProductCategoryConditionInput | null,
};

export type CreateProductCategoryMutation = {
  createProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateProductCategoryMutationVariables = {
  input?: UpdateProductCategoryInput,
  condition?: ModelProductCategoryConditionInput | null,
};

export type UpdateProductCategoryMutation = {
  updateProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteProductCategoryMutationVariables = {
  input?: DeleteProductCategoryInput,
  condition?: ModelProductCategoryConditionInput | null,
};

export type DeleteProductCategoryMutation = {
  deleteProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateChainProductMutationVariables = {
  input?: CreateChainProductInput,
  condition?: ModelChainProductConditionInput | null,
};

export type CreateChainProductMutation = {
  createChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateChainProductMutationVariables = {
  input?: UpdateChainProductInput,
  condition?: ModelChainProductConditionInput | null,
};

export type UpdateChainProductMutation = {
  updateChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteChainProductMutationVariables = {
  input?: DeleteChainProductInput,
  condition?: ModelChainProductConditionInput | null,
};

export type DeleteChainProductMutation = {
  deleteChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUnitMutationVariables = {
  input?: CreateUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type CreateUnitMutation = {
  createUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUnitMutationVariables = {
  input?: UpdateUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type UpdateUnitMutation = {
  updateUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUnitMutationVariables = {
  input?: DeleteUnitInput,
  condition?: ModelUnitConditionInput | null,
};

export type DeleteUnitMutation = {
  deleteUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateUserMutationVariables = {
  input?: CreateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type CreateUserMutation = {
  createUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateUserMutationVariables = {
  input?: UpdateUserInput,
  condition?: ModelUserConditionInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteUserMutationVariables = {
  input?: DeleteUserInput,
  condition?: ModelUserConditionInput | null,
};

export type DeleteUserMutation = {
  deleteUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetAdminUserQueryVariables = {
  id?: string,
};

export type GetAdminUserQuery = {
  getAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAdminUsersQueryVariables = {
  filter?: ModelAdminUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdminUsersQuery = {
  listAdminUsers?:  {
    __typename: "ModelAdminUserConnection",
    items?:  Array< {
      __typename: "AdminUser",
      id: string,
      name?: string | null,
      profileImage?: string | null,
      roles:  {
        __typename: "AdminUserRole",
        role: string,
        entities?:  Array< {
          __typename: "AdminRoleEntity",
          chainId?: string | null,
          groupId?: string | null,
          unitId?: string | null,
        } | null > | null,
      },
      settings?:  {
        __typename: "AdminUserSettings",
        selectedChainId?: string | null,
        selectedGroupId?: string | null,
        selectedUnitId?: string | null,
        selectedProductCategoryId?: string | null,
        selectedLanguage?: string | null,
        selectedHistoryDate?: number | null,
      } | null,
      email?: string | null,
      phone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetStripeCardQueryVariables = {
  id?: string,
};

export type GetStripeCardQuery = {
  getStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListStripeCardsQueryVariables = {
  filter?: ModelStripeCardFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListStripeCardsQuery = {
  listStripeCards?:  {
    __typename: "ModelStripeCardConnection",
    items?:  Array< {
      __typename: "StripeCard",
      brand?: CardBrand | null,
      checks?:  {
        __typename: "CardChecks",
        address_line1_check?: string | null,
        address_postal_code_check?: string | null,
        cvc_check?: string | null,
      } | null,
      country?: string | null,
      last4?: string | null,
      exp_month?: number | null,
      exp_year?: number | null,
      fingerprint?: string | null,
      funding?: CardFundingType | null,
      three_d_secure?: string | null,
      id: string,
      object: string,
      metadata:  Array< {
        __typename: "StripeMetadata",
        key: string,
        value: string,
      } >,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetChainQueryVariables = {
  id?: string,
};

export type GetChainQuery = {
  getChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListChainsQueryVariables = {
  filter?: ModelChainFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChainsQuery = {
  listChains?:  {
    __typename: "ModelChainConnection",
    items?:  Array< {
      __typename: "Chain",
      id: string,
      name?: string | null,
      description?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      style?:  {
        __typename: "ChainStyle",
        colors?:  {
          __typename: "ChainStyleColors",
          backgroundLight?: string | null,
          backgroundDark?: string | null,
          borderLight?: string | null,
          borderDark?: string | null,
          disabled?: string | null,
          highlight?: string | null,
          indicator?: string | null,
          textLight?: string | null,
          textDark?: string | null,
        } | null,
        images?:  {
          __typename: "ChainStyleImages",
          header?: string | null,
          logo?: string | null,
        } | null,
      } | null,
      isActive?: boolean | null,
      address?:  {
        __typename: "Address",
        address?: string | null,
        city?: string | null,
        country?: string | null,
        title?: string | null,
        postalCode?: string | null,
        location?:  {
          __typename: "Location",
          lat?: string | null,
          lng?: string | null,
        } | null,
      } | null,
      email?: string | null,
      phone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetGroupQueryVariables = {
  id?: string,
};

export type GetGroupQuery = {
  getGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListGroupsQueryVariables = {
  filter?: ModelGroupFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListGroupsQuery = {
  listGroups?:  {
    __typename: "ModelGroupConnection",
    items?:  Array< {
      __typename: "Group",
      id: string,
      chainId: string,
      name?: string | null,
      description?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      currency?: string | null,
      address?:  {
        __typename: "Address",
        address?: string | null,
        city?: string | null,
        country?: string | null,
        title?: string | null,
        postalCode?: string | null,
        location?:  {
          __typename: "Location",
          lat?: string | null,
          lng?: string | null,
        } | null,
      } | null,
      email?: string | null,
      phone?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetOrderQueryVariables = {
  id?: string,
};

export type GetOrderQuery = {
  getOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListOrdersQueryVariables = {
  filter?: ModelOrderFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListOrdersQuery = {
  listOrders?:  {
    __typename: "ModelOrderConnection",
    items?:  Array< {
      __typename: "Order",
      id: string,
      created?: number | null,
      items?:  Array< {
        __typename: "OrderItem",
        created?: number | null,
        productName?:  {
          __typename: "LocalizedItem",
          en?: string | null,
          de?: string | null,
          hu?: string | null,
        } | null,
        priceShown?:  {
          __typename: "PriceShown",
          currency?: string | null,
          pricePerUnit?: number | null,
          priceSum?: number | null,
          tax?: number | null,
          taxSum?: number | null,
        } | null,
        productId?: string | null,
        quantity?: number | null,
        statusLog?:  Array< {
          __typename: "StatusLog",
          userId?: string | null,
          status?: string | null,
          ts?: number | null,
        } | null > | null,
        variantId?: string | null,
        variantName?:  {
          __typename: "LocalizedItem",
          en?: string | null,
          de?: string | null,
          hu?: string | null,
        } | null,
        laneId?: string | null,
      } | null > | null,
      paymentMethod?: string | null,
      staffId?: string | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      sumPriceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      takeAway?: boolean | null,
      userId?: string | null,
      place?:  {
        __typename: "Place",
        seat?: string | null,
        table?: string | null,
      } | null,
      paymentIntention?: number | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetProductCategoryQueryVariables = {
  id?: string,
};

export type GetProductCategoryQuery = {
  getProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListProductCategorysQueryVariables = {
  filter?: ModelProductCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductCategorysQuery = {
  listProductCategorys?:  {
    __typename: "ModelProductCategoryConnection",
    items?:  Array< {
      __typename: "ProductCategory",
      id: string,
      chainId: string,
      description?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      image?: string | null,
      name?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      position?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetChainProductQueryVariables = {
  id?: string,
};

export type GetChainProductQuery = {
  getChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListChainProductsQueryVariables = {
  filter?: ModelChainProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListChainProductsQuery = {
  listChainProducts?:  {
    __typename: "ModelChainProductConnection",
    items?:  Array< {
      __typename: "ChainProduct",
      id: string,
      chainId: string,
      name?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      description?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      productCategoryId?: string | null,
      productType?: string | null,
      isVisible?: boolean | null,
      position?: string | null,
      image?: string | null,
      variants?:  Array< {
        __typename: "ProductVariant",
        id: string,
        variantName?:  {
          __typename: "LocalizedItem",
          en?: string | null,
          de?: string | null,
          hu?: string | null,
        } | null,
        pack?:  {
          __typename: "ProductVariantPack",
          size?: number | null,
          unit?: string | null,
        } | null,
        refGroupPrice?: number | null,
        isAvailable?: boolean | null,
        price?: number | null,
        availabilities?:  Array< {
          __typename: "Availability",
          type?: string | null,
          dayFrom?: string | null,
          dayTo?: string | null,
          timeFrom?: string | null,
          timeTo?: string | null,
          price?: number | null,
        } | null > | null,
        position?: string | null,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUnitQueryVariables = {
  id?: string,
};

export type GetUnitQuery = {
  getUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUnitsQueryVariables = {
  filter?: ModelUnitFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUnitsQuery = {
  listUnits?:  {
    __typename: "ModelUnitConnection",
    items?:  Array< {
      __typename: "Unit",
      id: string,
      groupId: string,
      chainId: string,
      isActive?: boolean | null,
      isAcceptingOrders?: boolean | null,
      name?: string | null,
      description?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      address?:  {
        __typename: "Address",
        address?: string | null,
        city?: string | null,
        country?: string | null,
        title?: string | null,
        postalCode?: string | null,
        location?:  {
          __typename: "Location",
          lat?: string | null,
          lng?: string | null,
        } | null,
      } | null,
      email?: string | null,
      phone?: string | null,
      paymentModes?:  Array< {
        __typename: "PaymentMode",
        name: string,
        caption?: string | null,
        method: string,
      } | null > | null,
      floorMap?:  {
        __typename: "FloorMapData",
        w?: number | null,
        h?: number | null,
        objects?:  Array< {
          __typename: "FloorMapDataObject",
          id: string,
          t: string,
          c?: string | null,
          w?: number | null,
          h?: number | null,
          r?: number | null,
          a?: number | null,
          x: number,
          y: number,
          tID?: string | null,
          sID?: string | null,
        } | null > | null,
      } | null,
      lanes?:  Array< {
        __typename: "Lane",
        id?: string | null,
        name?: string | null,
        color?: string | null,
      } | null > | null,
      open?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      openingHours?:  {
        __typename: "WeeklySchedule",
        mon?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        tue?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        wed?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        thu?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        fri?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        sat?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        sun?:  {
          __typename: "DailySchedule",
          from?: string | null,
          to?: string | null,
        } | null,
        override?:  Array< {
          __typename: "CustomDailySchedule",
          date?: string | null,
          from?: string | null,
          to?: string | null,
        } | null > | null,
      } | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id?: string,
};

export type GetUserQuery = {
  getUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers?:  {
    __typename: "ModelUserConnection",
    items?:  Array< {
      __typename: "User",
      id: string,
      name?: string | null,
      email?: string | null,
      phone?: string | null,
      profileImage?: string | null,
      login?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnAdminUserChangeSubscriptionVariables = {
  id?: string,
};

export type OnAdminUserChangeSubscription = {
  onAdminUserChange?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnAdminUsersChangeSubscription = {
  onAdminUsersChange?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnChainsChangeSubscription = {
  onChainsChange?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnGroupsChangeSubscription = {
  onGroupsChange?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUnitsChangeSubscription = {
  onUnitsChange?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUsersChangeSubscription = {
  onUsersChange?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnProductCategoriesChangeSubscription = {
  onProductCategoriesChange?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnChainProductChangeSubscription = {
  onChainProductChange?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateAdminUserSubscription = {
  onCreateAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAdminUserSubscription = {
  onUpdateAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAdminUserSubscription = {
  onDeleteAdminUser?:  {
    __typename: "AdminUser",
    id: string,
    name?: string | null,
    profileImage?: string | null,
    roles:  {
      __typename: "AdminUserRole",
      role: string,
      entities?:  Array< {
        __typename: "AdminRoleEntity",
        chainId?: string | null,
        groupId?: string | null,
        unitId?: string | null,
      } | null > | null,
    },
    settings?:  {
      __typename: "AdminUserSettings",
      selectedChainId?: string | null,
      selectedGroupId?: string | null,
      selectedUnitId?: string | null,
      selectedProductCategoryId?: string | null,
      selectedLanguage?: string | null,
      selectedHistoryDate?: number | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateStripeCardSubscription = {
  onCreateStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateStripeCardSubscription = {
  onUpdateStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteStripeCardSubscription = {
  onDeleteStripeCard?:  {
    __typename: "StripeCard",
    brand?: CardBrand | null,
    checks?:  {
      __typename: "CardChecks",
      address_line1_check?: string | null,
      address_postal_code_check?: string | null,
      cvc_check?: string | null,
    } | null,
    country?: string | null,
    last4?: string | null,
    exp_month?: number | null,
    exp_year?: number | null,
    fingerprint?: string | null,
    funding?: CardFundingType | null,
    three_d_secure?: string | null,
    id: string,
    object: string,
    metadata:  Array< {
      __typename: "StripeMetadata",
      key: string,
      value: string,
    } >,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateChainSubscription = {
  onCreateChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateChainSubscription = {
  onUpdateChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteChainSubscription = {
  onDeleteChain?:  {
    __typename: "Chain",
    id: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    style?:  {
      __typename: "ChainStyle",
      colors?:  {
        __typename: "ChainStyleColors",
        backgroundLight?: string | null,
        backgroundDark?: string | null,
        borderLight?: string | null,
        borderDark?: string | null,
        disabled?: string | null,
        highlight?: string | null,
        indicator?: string | null,
        textLight?: string | null,
        textDark?: string | null,
      } | null,
      images?:  {
        __typename: "ChainStyleImages",
        header?: string | null,
        logo?: string | null,
      } | null,
    } | null,
    isActive?: boolean | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateGroupSubscription = {
  onCreateGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateGroupSubscription = {
  onUpdateGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteGroupSubscription = {
  onDeleteGroup?:  {
    __typename: "Group",
    id: string,
    chainId: string,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    currency?: string | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateOrderSubscription = {
  onCreateOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateOrderSubscription = {
  onUpdateOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteOrderSubscription = {
  onDeleteOrder?:  {
    __typename: "Order",
    id: string,
    created?: number | null,
    items?:  Array< {
      __typename: "OrderItem",
      created?: number | null,
      productName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      priceShown?:  {
        __typename: "PriceShown",
        currency?: string | null,
        pricePerUnit?: number | null,
        priceSum?: number | null,
        tax?: number | null,
        taxSum?: number | null,
      } | null,
      productId?: string | null,
      quantity?: number | null,
      statusLog?:  Array< {
        __typename: "StatusLog",
        userId?: string | null,
        status?: string | null,
        ts?: number | null,
      } | null > | null,
      variantId?: string | null,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      laneId?: string | null,
    } | null > | null,
    paymentMethod?: string | null,
    staffId?: string | null,
    statusLog?:  Array< {
      __typename: "StatusLog",
      userId?: string | null,
      status?: string | null,
      ts?: number | null,
    } | null > | null,
    sumPriceShown?:  {
      __typename: "PriceShown",
      currency?: string | null,
      pricePerUnit?: number | null,
      priceSum?: number | null,
      tax?: number | null,
      taxSum?: number | null,
    } | null,
    takeAway?: boolean | null,
    userId?: string | null,
    place?:  {
      __typename: "Place",
      seat?: string | null,
      table?: string | null,
    } | null,
    paymentIntention?: number | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateProductCategorySubscription = {
  onCreateProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateProductCategorySubscription = {
  onUpdateProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteProductCategorySubscription = {
  onDeleteProductCategory?:  {
    __typename: "ProductCategory",
    id: string,
    chainId: string,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    image?: string | null,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    position?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateChainProductSubscription = {
  onCreateChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateChainProductSubscription = {
  onUpdateChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteChainProductSubscription = {
  onDeleteChainProduct?:  {
    __typename: "ChainProduct",
    id: string,
    chainId: string,
    name?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    productCategoryId?: string | null,
    productType?: string | null,
    isVisible?: boolean | null,
    position?: string | null,
    image?: string | null,
    variants?:  Array< {
      __typename: "ProductVariant",
      id: string,
      variantName?:  {
        __typename: "LocalizedItem",
        en?: string | null,
        de?: string | null,
        hu?: string | null,
      } | null,
      pack?:  {
        __typename: "ProductVariantPack",
        size?: number | null,
        unit?: string | null,
      } | null,
      refGroupPrice?: number | null,
      isAvailable?: boolean | null,
      price?: number | null,
      availabilities?:  Array< {
        __typename: "Availability",
        type?: string | null,
        dayFrom?: string | null,
        dayTo?: string | null,
        timeFrom?: string | null,
        timeTo?: string | null,
        price?: number | null,
      } | null > | null,
      position?: string | null,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUnitSubscription = {
  onCreateUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUnitSubscription = {
  onUpdateUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUnitSubscription = {
  onDeleteUnit?:  {
    __typename: "Unit",
    id: string,
    groupId: string,
    chainId: string,
    isActive?: boolean | null,
    isAcceptingOrders?: boolean | null,
    name?: string | null,
    description?:  {
      __typename: "LocalizedItem",
      en?: string | null,
      de?: string | null,
      hu?: string | null,
    } | null,
    address?:  {
      __typename: "Address",
      address?: string | null,
      city?: string | null,
      country?: string | null,
      title?: string | null,
      postalCode?: string | null,
      location?:  {
        __typename: "Location",
        lat?: string | null,
        lng?: string | null,
      } | null,
    } | null,
    email?: string | null,
    phone?: string | null,
    paymentModes?:  Array< {
      __typename: "PaymentMode",
      name: string,
      caption?: string | null,
      method: string,
    } | null > | null,
    floorMap?:  {
      __typename: "FloorMapData",
      w?: number | null,
      h?: number | null,
      objects?:  Array< {
        __typename: "FloorMapDataObject",
        id: string,
        t: string,
        c?: string | null,
        w?: number | null,
        h?: number | null,
        r?: number | null,
        a?: number | null,
        x: number,
        y: number,
        tID?: string | null,
        sID?: string | null,
      } | null > | null,
    } | null,
    lanes?:  Array< {
      __typename: "Lane",
      id?: string | null,
      name?: string | null,
      color?: string | null,
    } | null > | null,
    open?:  {
      __typename: "DailySchedule",
      from?: string | null,
      to?: string | null,
    } | null,
    openingHours?:  {
      __typename: "WeeklySchedule",
      mon?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      tue?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      wed?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      thu?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      fri?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sat?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      sun?:  {
        __typename: "DailySchedule",
        from?: string | null,
        to?: string | null,
      } | null,
      override?:  Array< {
        __typename: "CustomDailySchedule",
        date?: string | null,
        from?: string | null,
        to?: string | null,
      } | null > | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser?:  {
    __typename: "User",
    id: string,
    name?: string | null,
    email?: string | null,
    phone?: string | null,
    profileImage?: string | null,
    login?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
