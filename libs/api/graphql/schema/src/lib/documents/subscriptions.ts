/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onAdminUserChange = /* GraphQL */ `
  subscription OnAdminUserChange {
    onAdminUserChange {
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
export const onChainChange = /* GraphQL */ `
  subscription OnChainChange {
    onChainChange {
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
export const onGroupChange = /* GraphQL */ `
  subscription OnGroupChange {
    onGroupChange {
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
export const onUnitChange = /* GraphQL */ `
  subscription OnUnitChange {
    onUnitChange {
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
export const onUserChange = /* GraphQL */ `
  subscription OnUserChange {
    onUserChange {
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
export const onProductCategoryChange = /* GraphQL */ `
  subscription OnProductCategoryChange {
    onProductCategoryChange {
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
export const onCreateAdminUser = /* GraphQL */ `
  subscription OnCreateAdminUser {
    onCreateAdminUser {
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
export const onUpdateAdminUser = /* GraphQL */ `
  subscription OnUpdateAdminUser {
    onUpdateAdminUser {
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
export const onDeleteAdminUser = /* GraphQL */ `
  subscription OnDeleteAdminUser {
    onDeleteAdminUser {
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
export const onCreateStripeCard = /* GraphQL */ `
  subscription OnCreateStripeCard {
    onCreateStripeCard {
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
export const onUpdateStripeCard = /* GraphQL */ `
  subscription OnUpdateStripeCard {
    onUpdateStripeCard {
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
export const onDeleteStripeCard = /* GraphQL */ `
  subscription OnDeleteStripeCard {
    onDeleteStripeCard {
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
export const onCreateChain = /* GraphQL */ `
  subscription OnCreateChain {
    onCreateChain {
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
export const onUpdateChain = /* GraphQL */ `
  subscription OnUpdateChain {
    onUpdateChain {
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
export const onDeleteChain = /* GraphQL */ `
  subscription OnDeleteChain {
    onDeleteChain {
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
export const onCreateGroup = /* GraphQL */ `
  subscription OnCreateGroup {
    onCreateGroup {
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
export const onUpdateGroup = /* GraphQL */ `
  subscription OnUpdateGroup {
    onUpdateGroup {
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
export const onDeleteGroup = /* GraphQL */ `
  subscription OnDeleteGroup {
    onDeleteGroup {
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
export const onCreateOrder = /* GraphQL */ `
  subscription OnCreateOrder {
    onCreateOrder {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder {
    onDeleteOrder {
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
export const onCreateProductCategory = /* GraphQL */ `
  subscription OnCreateProductCategory {
    onCreateProductCategory {
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
export const onUpdateProductCategory = /* GraphQL */ `
  subscription OnUpdateProductCategory {
    onUpdateProductCategory {
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
export const onDeleteProductCategory = /* GraphQL */ `
  subscription OnDeleteProductCategory {
    onDeleteProductCategory {
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
export const onCreateChainProduct = /* GraphQL */ `
  subscription OnCreateChainProduct {
    onCreateChainProduct {
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
export const onUpdateChainProduct = /* GraphQL */ `
  subscription OnUpdateChainProduct {
    onUpdateChainProduct {
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
export const onDeleteChainProduct = /* GraphQL */ `
  subscription OnDeleteChainProduct {
    onDeleteChainProduct {
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
export const onCreateUnit = /* GraphQL */ `
  subscription OnCreateUnit {
    onCreateUnit {
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
export const onUpdateUnit = /* GraphQL */ `
  subscription OnUpdateUnit {
    onUpdateUnit {
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
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit {
    onDeleteUnit {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
