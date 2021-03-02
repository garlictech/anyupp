/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const syncAdminUsers = /* GraphQL */ `
  query SyncAdminUsers(
    $filter: ModelAdminUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncAdminUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        profileImage
        email
        phone
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getAdminUser = /* GraphQL */ `
  query GetAdminUser($id: ID!) {
    getAdminUser(id: $id) {
      id
      name
      profileImage
      roles {
        role
      }
      settings {
        selectedChainId
        selectedGroupId
        selectedUnitId
        selectedProductCategoryId
        selectedLanguage
        selectedHistoryDate
      }
      email
      phone
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listAdminUsers = /* GraphQL */ `
  query ListAdminUsers(
    $filter: ModelAdminUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdminUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        profileImage
        email
        phone
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncStripeCards = /* GraphQL */ `
  query SyncStripeCards(
    $filter: ModelStripeCardFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncStripeCards(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        brand
        country
        last4
        exp_month
        exp_year
        fingerprint
        funding
        three_d_secure
        id
        object
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getStripeCard = /* GraphQL */ `
  query GetStripeCard($id: ID!) {
    getStripeCard(id: $id) {
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
      id
      object
      metadata {
        key
        value
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listStripeCards = /* GraphQL */ `
  query ListStripeCards(
    $filter: ModelStripeCardFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listStripeCards(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        brand
        country
        last4
        exp_month
        exp_year
        fingerprint
        funding
        three_d_secure
        id
        object
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChains = /* GraphQL */ `
  query SyncChains(
    $filter: ModelChainFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChains(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        isActive
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getChain = /* GraphQL */ `
  query GetChain($id: ID!) {
    getChain(id: $id) {
      id
      name
      description {
        en
        de
        hu
      }
      isActive
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listChains = /* GraphQL */ `
  query ListChains(
    $filter: ModelChainFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChains(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        isActive
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncGroups = /* GraphQL */ `
  query SyncGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncGroups(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        chainId
        name
        currency
        email
        phone
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getGroup = /* GraphQL */ `
  query GetGroup($id: ID!) {
    getGroup(id: $id) {
      id
      chainId
      name
      description {
        en
        de
        hu
      }
      currency
      address {
        address
        city
        country
        title
        postalCode
      }
      email
      phone
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listGroups = /* GraphQL */ `
  query ListGroups(
    $filter: ModelGroupFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroups(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        chainId
        name
        currency
        email
        phone
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncOrders = /* GraphQL */ `
  query SyncOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncOrders(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        created
        paymentMethod
        staffId
        takeAway
        userId
        paymentIntention
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
      id
      created
      items {
        id
        created
        productId
        quantity
        variantId
        laneId
      }
      paymentMethod
      staffId
      statusLog {
        userId
        status
        ts
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      takeAway
      userId
      place {
        seat
        table
      }
      paymentIntention
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listOrders = /* GraphQL */ `
  query ListOrders(
    $filter: ModelOrderFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrders(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        created
        paymentMethod
        staffId
        takeAway
        userId
        paymentIntention
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncProductCategories = /* GraphQL */ `
  query SyncProductCategories(
    $filter: ModelProductCategoryFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncProductCategories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        image
        position
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getProductCategory = /* GraphQL */ `
  query GetProductCategory($id: ID!) {
    getProductCategory(id: $id) {
      id
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listProductCategorys = /* GraphQL */ `
  query ListProductCategorys(
    $filter: ModelProductCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductCategorys(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        image
        position
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncChainProducts = /* GraphQL */ `
  query SyncChainProducts(
    $filter: ModelChainProductFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChainProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        extends
        image
        isVisible
        tax
        position
        productCategoryId
        laneId
        productType
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getChainProduct = /* GraphQL */ `
  query GetChainProduct($id: ID!) {
    getChainProduct(id: $id) {
      id
      description {
        en
        de
        hu
      }
      extends
      image
      isVisible
      tax
      name {
        en
        de
        hu
      }
      position
      productCategoryId
      laneId
      productType
      variants {
        refGroupPrice
        isAvailable
        price
        availableFrom
        position
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listChainProducts = /* GraphQL */ `
  query ListChainProducts(
    $filter: ModelChainProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChainProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        extends
        image
        isVisible
        tax
        position
        productCategoryId
        laneId
        productType
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUnits = /* GraphQL */ `
  query SyncUnits(
    $filter: ModelUnitFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUnits(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        groupId
        isActive
        isAcceptingOrders
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getUnit = /* GraphQL */ `
  query GetUnit($id: ID!) {
    getUnit(id: $id) {
      id
      groupId
      isActive
      isAcceptingOrders
      name
      description {
        en
        de
        hu
      }
      paymentModes {
        name
        caption
        method
      }
      floorMap {
        w
        h
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listUnits = /* GraphQL */ `
  query ListUnits(
    $filter: ModelUnitFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnits(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        groupId
        isActive
        isAcceptingOrders
        name
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        email
        phone
        profileImage
        login
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      phone
      profileImage
      login
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        email
        phone
        profileImage
        login
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
      }
      nextToken
      startedAt
    }
  }
`;
