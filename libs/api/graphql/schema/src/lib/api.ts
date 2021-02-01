import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface AdminUserInput {
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
}

export interface AddressInput {
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  location?: Maybe<LocationInput>;
  postalCode?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
}

export interface LocationInput {
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
}

export interface AdminUserRoleInput {
  entities?: Maybe<Array<Maybe<AdminRoleEntityInput>>>;
  role: Scalars['String'];
}

export interface AdminRoleEntityInput {
  chainId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
}

export interface Query {
  __typename?: 'Query';
  getAdminUser?: Maybe<AdminUser>;
  getCustomerStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
}

export interface QueryGetAdminUserArgs {
  id: Scalars['ID'];
}

export interface QueryGetCustomerStripeCardsArgs {
  customerId?: Maybe<Scalars['ID']>;
}

export interface Subscription {
  __typename?: 'Subscription';
  adminUserChanged?: Maybe<AdminUser>;
}

export interface SubscriptionAdminUserChangedArgs {
  id: Scalars['ID'];
}

export interface Mutation {
  __typename?: 'Mutation';
  createAdminUser: Scalars['Boolean'];
  startStripePayment: Scalars['String'];
  updateAdminUser: Scalars['Boolean'];
  updateAdminUserRole: Scalars['Boolean'];
}

export interface MutationCreateAdminUserArgs {
  newAdminData: AdminUserInput;
}

export interface MutationStartStripePaymentArgs {
  chainId: Scalars['ID'];
  unitId: Scalars['ID'];
  userId: Scalars['ID'];
}

export interface MutationUpdateAdminUserArgs {
  id: Scalars['ID'];
  newAdminData: AdminUserInput;
}

export interface MutationUpdateAdminUserRoleArgs {
  id: Scalars['ID'];
  newAdminRoleData: AdminUserRoleInput;
}

export interface AdminUser {
  __typename?: 'AdminUser';
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  roles: AdminUserRole;
  settings?: Maybe<AdminUserSettings>;
}

export interface AdminUserRole {
  __typename?: 'AdminUserRole';
  entities?: Maybe<Array<Maybe<AdminRoleEntity>>>;
  role: Scalars['String'];
}

export interface AdminUserSettings {
  __typename?: 'AdminUserSettings';
  selectedChainId?: Maybe<Scalars['String']>;
  selectedGroupId?: Maybe<Scalars['String']>;
  selectedHistoryDate?: Maybe<Scalars['Int']>;
  selectedLanguage?: Maybe<Scalars['String']>;
  selectedProductCategoryId?: Maybe<Scalars['String']>;
  selectedUnitId?: Maybe<Scalars['String']>;
}

export interface Address {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  location?: Maybe<Location>;
  postalCode?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
}

export interface Location {
  __typename?: 'Location';
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
}

export interface AdminRoleEntity {
  __typename?: 'AdminRoleEntity';
  chainId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
}

export interface Chain {
  __typename?: 'Chain';
  description?: Maybe<LocalizedItem>;
  id: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  style?: Maybe<ChainStyle>;
}

export interface ChainStyle {
  __typename?: 'ChainStyle';
  colors?: Maybe<ChainStyleColors>;
  images?: Maybe<ChainStyleImages>;
}

export interface LocalizedItem {
  __typename?: 'LocalizedItem';
  de?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface ChainStyleColors {
  __typename?: 'ChainStyleColors';
  backgroundDark?: Maybe<Scalars['String']>;
  backgroundLight?: Maybe<Scalars['String']>;
  borderDark?: Maybe<Scalars['String']>;
  borderLight?: Maybe<Scalars['String']>;
  disabled?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['String']>;
  indicator?: Maybe<Scalars['String']>;
  textDark?: Maybe<Scalars['String']>;
  textLight?: Maybe<Scalars['String']>;
}

export interface ChainStyleImages {
  __typename?: 'ChainStyleImages';
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface DailySchedule {
  __typename?: 'DailySchedule';
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface CustomDailySchedule {
  __typename?: 'CustomDailySchedule';
  date?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface WeeklySchedule {
  __typename?: 'WeeklySchedule';
  fri?: Maybe<DailySchedule>;
  mon?: Maybe<DailySchedule>;
  override?: Maybe<Array<Maybe<CustomDailySchedule>>>;
  sat?: Maybe<DailySchedule>;
  sun?: Maybe<DailySchedule>;
  thu?: Maybe<DailySchedule>;
  tue?: Maybe<DailySchedule>;
  wed?: Maybe<DailySchedule>;
}

/** An ISO 3166-1 alpha-2 country code. Available country codes can be listed with the List Country Specs endpoint. */
export enum CountryCode {
  af = 'AF',
  ax = 'AX',
  al = 'AL',
  dz = 'DZ',
  as = 'AS',
  ad = 'AD',
  ao = 'AO',
  ai = 'AI',
  aq = 'AQ',
  ag = 'AG',
  ar = 'AR',
  am = 'AM',
  aw = 'AW',
  au = 'AU',
  at = 'AT',
  az = 'AZ',
  bs = 'BS',
  bh = 'BH',
  bd = 'BD',
  bb = 'BB',
  by = 'BY',
  be = 'BE',
  bz = 'BZ',
  bj = 'BJ',
  bm = 'BM',
  bt = 'BT',
  bo = 'BO',
  bq = 'BQ',
  ba = 'BA',
  bw = 'BW',
  bv = 'BV',
  br = 'BR',
  io = 'IO',
  vg = 'VG',
  bn = 'BN',
  bg = 'BG',
  bf = 'BF',
  bi = 'BI',
  kh = 'KH',
  cm = 'CM',
  ca = 'CA',
  cv = 'CV',
  ky = 'KY',
  cf = 'CF',
  td = 'TD',
  cl = 'CL',
  cn = 'CN',
  cx = 'CX',
  cc = 'CC',
  co = 'CO',
  km = 'KM',
  ck = 'CK',
  cr = 'CR',
  hr = 'HR',
  cu = 'CU',
  cw = 'CW',
  cy = 'CY',
  cz = 'CZ',
  cd = 'CD',
  dk = 'DK',
  dj = 'DJ',
  dm = 'DM',
  do = 'DO',
  tl = 'TL',
  ec = 'EC',
  eg = 'EG',
  sv = 'SV',
  gq = 'GQ',
  er = 'ER',
  ee = 'EE',
  et = 'ET',
  fk = 'FK',
  fo = 'FO',
  fj = 'FJ',
  fi = 'FI',
  fr = 'FR',
  gf = 'GF',
  pf = 'PF',
  tf = 'TF',
  ga = 'GA',
  gm = 'GM',
  ge = 'GE',
  de = 'DE',
  gh = 'GH',
  gi = 'GI',
  gr = 'GR',
  gl = 'GL',
  gd = 'GD',
  gp = 'GP',
  gu = 'GU',
  gt = 'GT',
  gg = 'GG',
  gn = 'GN',
  gw = 'GW',
  gy = 'GY',
  ht = 'HT',
  hm = 'HM',
  hn = 'HN',
  hk = 'HK',
  hu = 'HU',
  is = 'IS',
  in = 'IN',
  id = 'ID',
  ir = 'IR',
  iq = 'IQ',
  ie = 'IE',
  im = 'IM',
  il = 'IL',
  it = 'IT',
  ci = 'CI',
  jm = 'JM',
  jp = 'JP',
  je = 'JE',
  jo = 'JO',
  kz = 'KZ',
  ke = 'KE',
  ki = 'KI',
  xk = 'XK',
  kw = 'KW',
  kg = 'KG',
  la = 'LA',
  lv = 'LV',
  lb = 'LB',
  ls = 'LS',
  lr = 'LR',
  ly = 'LY',
  li = 'LI',
  lt = 'LT',
  lu = 'LU',
  mo = 'MO',
  mk = 'MK',
  mg = 'MG',
  mw = 'MW',
  my = 'MY',
  mv = 'MV',
  ml = 'ML',
  mt = 'MT',
  mh = 'MH',
  mq = 'MQ',
  mr = 'MR',
  mu = 'MU',
  yt = 'YT',
  mx = 'MX',
  fm = 'FM',
  md = 'MD',
  mc = 'MC',
  mn = 'MN',
  me = 'ME',
  ms = 'MS',
  ma = 'MA',
  mz = 'MZ',
  mm = 'MM',
  na = 'NA',
  nr = 'NR',
  np = 'NP',
  nl = 'NL',
  an = 'AN',
  nc = 'NC',
  nz = 'NZ',
  ni = 'NI',
  ne = 'NE',
  ng = 'NG',
  nu = 'NU',
  nf = 'NF',
  kp = 'KP',
  mp = 'MP',
  no = 'NO',
  om = 'OM',
  pk = 'PK',
  pw = 'PW',
  ps = 'PS',
  pa = 'PA',
  pg = 'PG',
  py = 'PY',
  pe = 'PE',
  ph = 'PH',
  pn = 'PN',
  pl = 'PL',
  pt = 'PT',
  pr = 'PR',
  qa = 'QA',
  cg = 'CG',
  re = 'RE',
  ro = 'RO',
  ru = 'RU',
  rw = 'RW',
  bl = 'BL',
  sh = 'SH',
  kn = 'KN',
  lc = 'LC',
  mf = 'MF',
  pm = 'PM',
  vc = 'VC',
  ws = 'WS',
  sm = 'SM',
  st = 'ST',
  sa = 'SA',
  sn = 'SN',
  rs = 'RS',
  cs = 'CS',
  sc = 'SC',
  sl = 'SL',
  sg = 'SG',
  sx = 'SX',
  sk = 'SK',
  si = 'SI',
  sb = 'SB',
  so = 'SO',
  za = 'ZA',
  gs = 'GS',
  kr = 'KR',
  ss = 'SS',
  es = 'ES',
  lk = 'LK',
  sd = 'SD',
  sr = 'SR',
  sj = 'SJ',
  sz = 'SZ',
  se = 'SE',
  ch = 'CH',
  sy = 'SY',
  tw = 'TW',
  tj = 'TJ',
  tz = 'TZ',
  th = 'TH',
  tg = 'TG',
  tk = 'TK',
  to = 'TO',
  tt = 'TT',
  tn = 'TN',
  tr = 'TR',
  tm = 'TM',
  tc = 'TC',
  tv = 'TV',
  vi = 'VI',
  ug = 'UG',
  ua = 'UA',
  ae = 'AE',
  gb = 'GB',
  us = 'US',
  um = 'UM',
  uy = 'UY',
  uz = 'UZ',
  vu = 'VU',
  va = 'VA',
  ve = 'VE',
  vn = 'VN',
  wf = 'WF',
  eh = 'EH',
  ye = 'YE',
  zm = 'ZM',
  zw = 'ZW',
}

/** Three-letter <a href="https://stripe.com/docs/currencies">ISO code for the currency</a> the customer can be charged in for recurring billing purposes. */
export enum Currency {
  usd = 'usd',
  aed = 'aed',
  afn = 'afn',
  all = 'all',
  amd = 'amd',
  ang = 'ang',
  aoa = 'aoa',
  ars = 'ars',
  aud = 'aud',
  awg = 'awg',
  azn = 'azn',
  bam = 'bam',
  bbd = 'bbd',
  bdt = 'bdt',
  bgn = 'bgn',
  bif = 'bif',
  bmd = 'bmd',
  bnd = 'bnd',
  bob = 'bob',
  brl = 'brl',
  bsd = 'bsd',
  bwp = 'bwp',
  bzd = 'bzd',
  cad = 'cad',
  cdf = 'cdf',
  chf = 'chf',
  clp = 'clp',
  cny = 'cny',
  cop = 'cop',
  crc = 'crc',
  cve = 'cve',
  czk = 'czk',
  djf = 'djf',
  dkk = 'dkk',
  dop = 'dop',
  dzd = 'dzd',
  egp = 'egp',
  etb = 'etb',
  eur = 'eur',
  fjd = 'fjd',
  fkp = 'fkp',
  gbp = 'gbp',
  gel = 'gel',
  gip = 'gip',
  gmd = 'gmd',
  gnf = 'gnf',
  gtq = 'gtq',
  gyd = 'gyd',
  hkd = 'hkd',
  hnl = 'hnl',
  hrk = 'hrk',
  htg = 'htg',
  huf = 'huf',
  idr = 'idr',
  ils = 'ils',
  inr = 'inr',
  isk = 'isk',
  jmd = 'jmd',
  jpy = 'jpy',
  kes = 'kes',
  kgs = 'kgs',
  khr = 'khr',
  kmf = 'kmf',
  krw = 'krw',
  kyd = 'kyd',
  kzt = 'kzt',
  lak = 'lak',
  lbp = 'lbp',
  lkr = 'lkr',
  lrd = 'lrd',
  lsl = 'lsl',
  mad = 'mad',
  mdl = 'mdl',
  mga = 'mga',
  mkd = 'mkd',
  mmk = 'mmk',
  mnt = 'mnt',
  mop = 'mop',
  mro = 'mro',
  mur = 'mur',
  mvr = 'mvr',
  mwk = 'mwk',
  mxn = 'mxn',
  myr = 'myr',
  mzn = 'mzn',
  nad = 'nad',
  ngn = 'ngn',
  nio = 'nio',
  nok = 'nok',
  npr = 'npr',
  nzd = 'nzd',
  pab = 'pab',
  pen = 'pen',
  pgk = 'pgk',
  php = 'php',
  pkr = 'pkr',
  pln = 'pln',
  pyg = 'pyg',
  qar = 'qar',
  ron = 'ron',
  rsd = 'rsd',
  rub = 'rub',
  rwf = 'rwf',
  sar = 'sar',
  sbd = 'sbd',
  scr = 'scr',
  sek = 'sek',
  sgd = 'sgd',
  shp = 'shp',
  sll = 'sll',
  sos = 'sos',
  srd = 'srd',
  std = 'std',
  szl = 'szl',
  thb = 'thb',
  tjs = 'tjs',
  top = 'top',
  try = 'try',
  ttd = 'ttd',
  twd = 'twd',
  tzs = 'tzs',
  uah = 'uah',
  ugx = 'ugx',
  uyu = 'uyu',
  uzs = 'uzs',
  vnd = 'vnd',
  vuv = 'vuv',
  wst = 'wst',
  xaf = 'xaf',
  xcd = 'xcd',
  xof = 'xof',
  xpf = 'xpf',
  yer = 'yer',
  zar = 'zar',
  zmw = 'zmw',
}

export interface Group {
  __typename?: 'Group';
  address?: Maybe<Address>;
  chainId: Scalars['ID'];
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItem>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface Order {
  __typename?: 'Order';
  created?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  paymentIntention?: Maybe<Scalars['Int']>;
  paymentMethod?: Maybe<Scalars['String']>;
  place?: Maybe<Place>;
  staffId?: Maybe<Scalars['ID']>;
  statusLog?: Maybe<Array<Maybe<StatusLog>>>;
  sumPriceShown?: Maybe<PriceShown>;
  takeAway?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['ID']>;
}

export interface OrderItem {
  __typename?: 'OrderItem';
  created?: Maybe<Scalars['Int']>;
  laneId?: Maybe<Scalars['ID']>;
  priceShown?: Maybe<PriceShown>;
  productId?: Maybe<Scalars['ID']>;
  productName?: Maybe<LocalizedItem>;
  quantity?: Maybe<Scalars['Int']>;
  statusLog?: Maybe<Array<Maybe<StatusLog>>>;
  variantId?: Maybe<Scalars['ID']>;
  variantName?: Maybe<LocalizedItem>;
}

export interface StatusLog {
  __typename?: 'StatusLog';
  status?: Maybe<Scalars['String']>;
  ts?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['ID']>;
}

export interface PriceShown {
  __typename?: 'PriceShown';
  currency?: Maybe<Scalars['String']>;
  pricePerUnit?: Maybe<Scalars['Float']>;
  priceSum?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Int']>;
  taxSum?: Maybe<Scalars['Float']>;
}

export interface Place {
  __typename?: 'Place';
  seat?: Maybe<Scalars['String']>;
  table?: Maybe<Scalars['String']>;
}

export interface ProductCategory {
  __typename?: 'ProductCategory';
  description?: Maybe<LocalizedItem>;
  id?: Maybe<Scalars['ID']>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<LocalizedItem>;
  position?: Maybe<Scalars['String']>;
}

export interface ChainProduct {
  __typename?: 'ChainProduct';
  description?: Maybe<LocalizedItem>;
  extends?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  laneId?: Maybe<Scalars['ID']>;
  name?: Maybe<LocalizedItem>;
  position?: Maybe<Scalars['String']>;
  productCategoryId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  tax?: Maybe<Scalars['Int']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface ProductVariant {
  __typename?: 'ProductVariant';
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  availableFrom?: Maybe<Scalars['String']>;
  isAvailable?: Maybe<Scalars['Boolean']>;
  pack?: Maybe<ProductVariantPack>;
  position?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  refGroupPrice?: Maybe<Scalars['Float']>;
  variantName?: Maybe<LocalizedItem>;
}

export interface ProductVariantPack {
  __typename?: 'ProductVariantPack';
  size?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
}

export interface Availability {
  __typename?: 'Availability';
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
}

export enum CardBrand {
  amex = 'amex',
  diners = 'diners',
  discover = 'discover',
  jcb = 'jcb',
  mastercard = 'mastercard',
  unionpay = 'unionpay',
  visa = 'visa',
  unknown = 'unknown',
}

export enum CardFundingType {
  credit = 'credit',
  debit = 'debit',
  prepaid = 'prepaid',
  unknown = 'unknown',
}

export interface CardChecks {
  __typename?: 'CardChecks';
  address_line1_check?: Maybe<Scalars['String']>;
  address_postal_code_check?: Maybe<Scalars['String']>;
  cvc_check?: Maybe<Scalars['String']>;
}

export interface StripeMetadata {
  __typename?: 'StripeMetadata';
  key: Scalars['String'];
  value: Scalars['String'];
}

export interface StripeMetadataInterface {
  metadata: Array<StripeMetadata>;
}

export interface NodeInterface {
  id: Scalars['ID'];
  object: Scalars['String'];
}

export interface StripeCard extends StripeMetadataInterface, NodeInterface {
  __typename?: 'StripeCard';
  brand?: Maybe<CardBrand>;
  checks?: Maybe<CardChecks>;
  country?: Maybe<CountryCode>;
  last4?: Maybe<Scalars['String']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  three_d_secure?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  object: Scalars['String'];
  metadata: Array<StripeMetadata>;
}

export interface Unit {
  __typename?: 'Unit';
  description?: Maybe<LocalizedItem>;
  floorMap?: Maybe<FloorMapData>;
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  isAcceptingOrders?: Maybe<Scalars['Boolean']>;
  isActive?: Maybe<Scalars['Boolean']>;
  lanes?: Maybe<Array<Maybe<Lane>>>;
  name?: Maybe<Scalars['String']>;
  open?: Maybe<DailySchedule>;
  openingHours?: Maybe<WeeklySchedule>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
}

export interface PaymentMode {
  __typename?: 'PaymentMode';
  caption?: Maybe<Scalars['String']>;
  method: Scalars['String'];
  name: Scalars['String'];
}

export interface FloorMapData {
  __typename?: 'FloorMapData';
  h?: Maybe<Scalars['Int']>;
  objects?: Maybe<Array<Maybe<FloorMapDataObject>>>;
  w?: Maybe<Scalars['Int']>;
}

export interface Lane {
  __typename?: 'Lane';
  color?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
}

export interface FloorMapDataObject {
  __typename?: 'FloorMapDataObject';
  a?: Maybe<Scalars['Int']>;
  c?: Maybe<Scalars['String']>;
  h?: Maybe<Scalars['Int']>;
  id: Scalars['ID'];
  r?: Maybe<Scalars['Int']>;
  sID?: Maybe<Scalars['String']>;
  t: Scalars['String'];
  tID?: Maybe<Scalars['String']>;
  w?: Maybe<Scalars['Int']>;
  x: Scalars['Int'];
  y: Scalars['Int'];
}

export interface User {
  __typename?: 'User';
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  login?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
}

export type GetAdminUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetAdminUserQuery = { __typename?: 'Query' } & {
  getAdminUser?: Maybe<
    { __typename?: 'AdminUser' } & Pick<AdminUser, 'email' | 'name' | 'phone'>
  >;
};

export type CreateAdminUserMutationVariables = Exact<{
  data: AdminUserInput;
}>;

export type CreateAdminUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'createAdminUser'
>;

export type UpdateAdminUserMutationVariables = Exact<{
  data: AdminUserInput;
  id: Scalars['ID'];
}>;

export type UpdateAdminUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateAdminUser'
>;

export type UpdateAdminUserRoleMutationVariables = Exact<{
  data: AdminUserRoleInput;
  id: Scalars['ID'];
}>;

export type UpdateAdminUserRoleMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateAdminUserRole'
>;

export const GetAdminUser = gql`
  query GetAdminUser($id: ID!) {
    getAdminUser(id: $id) {
      email
      name
      phone
    }
  }
`;
export const CreateAdminUser = gql`
  mutation CreateAdminUser($data: AdminUserInput!) {
    createAdminUser(newAdminData: $data)
  }
`;
export const UpdateAdminUser = gql`
  mutation UpdateAdminUser($data: AdminUserInput!, $id: ID!) {
    updateAdminUser(newAdminData: $data, id: $id)
  }
`;
export const UpdateAdminUserRole = gql`
  mutation UpdateAdminUserRole($data: AdminUserRoleInput!, $id: ID!) {
    updateAdminUserRole(newAdminRoleData: $data, id: $id)
  }
`;
