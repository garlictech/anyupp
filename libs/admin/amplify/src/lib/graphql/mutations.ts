/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAdminUser = /* GraphQL */ `
  mutation CreateAdminUser(
    $input: CreateAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    createAdminUser(input: $input, condition: $condition) {
      id
      name
      profileImage
      roles {
        role
        entities {
          chainId
          groupId
          unitId
        }
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
export const updateAdminUser = /* GraphQL */ `
  mutation UpdateAdminUser(
    $input: UpdateAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    updateAdminUser(input: $input, condition: $condition) {
      id
      name
      profileImage
      roles {
        role
        entities {
          chainId
          groupId
          unitId
        }
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
export const deleteAdminUser = /* GraphQL */ `
  mutation DeleteAdminUser(
    $input: DeleteAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    deleteAdminUser(input: $input, condition: $condition) {
      id
      name
      profileImage
      roles {
        role
        entities {
          chainId
          groupId
          unitId
        }
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
export const createStripeCard = /* GraphQL */ `
  mutation CreateStripeCard(
    $input: CreateStripeCardInput!
    $condition: ModelStripeCardConditionInput
  ) {
    createStripeCard(input: $input, condition: $condition) {
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
export const updateStripeCard = /* GraphQL */ `
  mutation UpdateStripeCard(
    $input: UpdateStripeCardInput!
    $condition: ModelStripeCardConditionInput
  ) {
    updateStripeCard(input: $input, condition: $condition) {
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
export const deleteStripeCard = /* GraphQL */ `
  mutation DeleteStripeCard(
    $input: DeleteStripeCardInput!
    $condition: ModelStripeCardConditionInput
  ) {
    deleteStripeCard(input: $input, condition: $condition) {
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
export const createChain = /* GraphQL */ `
  mutation CreateChain(
    $input: CreateChainInput!
    $condition: ModelChainConditionInput
  ) {
    createChain(input: $input, condition: $condition) {
      id
      name
      description {
        en
        de
        hu
      }
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          highlight
          indicator
          textLight
          textDark
        }
        images {
          header
          logo
        }
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
export const updateChain = /* GraphQL */ `
  mutation UpdateChain(
    $input: UpdateChainInput!
    $condition: ModelChainConditionInput
  ) {
    updateChain(input: $input, condition: $condition) {
      id
      name
      description {
        en
        de
        hu
      }
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          highlight
          indicator
          textLight
          textDark
        }
        images {
          header
          logo
        }
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
export const deleteChain = /* GraphQL */ `
  mutation DeleteChain(
    $input: DeleteChainInput!
    $condition: ModelChainConditionInput
  ) {
    deleteChain(input: $input, condition: $condition) {
      id
      name
      description {
        en
        de
        hu
      }
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          highlight
          indicator
          textLight
          textDark
        }
        images {
          header
          logo
        }
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
export const createGroup = /* GraphQL */ `
  mutation CreateGroup(
    $input: CreateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    createGroup(input: $input, condition: $condition) {
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
        location {
          lat
          lng
        }
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
export const updateGroup = /* GraphQL */ `
  mutation UpdateGroup(
    $input: UpdateGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    updateGroup(input: $input, condition: $condition) {
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
        location {
          lat
          lng
        }
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
export const deleteGroup = /* GraphQL */ `
  mutation DeleteGroup(
    $input: DeleteGroupInput!
    $condition: ModelGroupConditionInput
  ) {
    deleteGroup(input: $input, condition: $condition) {
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
        location {
          lat
          lng
        }
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
export const createOrder = /* GraphQL */ `
  mutation CreateOrder(
    $input: CreateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    createOrder(input: $input, condition: $condition) {
      id
      created
      items {
        id
        created
        productName {
          en
          de
          hu
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        productId
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantId
        variantName {
          en
          de
          hu
        }
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
      id
      created
      items {
        id
        created
        productName {
          en
          de
          hu
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        productId
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantId
        variantName {
          en
          de
          hu
        }
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
      id
      created
      items {
        id
        created
        productName {
          en
          de
          hu
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        productId
        quantity
        statusLog {
          userId
          status
          ts
        }
        variantId
        variantName {
          en
          de
          hu
        }
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
export const createProductCategory = /* GraphQL */ `
  mutation CreateProductCategory(
    $input: CreateProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    createProductCategory(input: $input, condition: $condition) {
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
export const updateProductCategory = /* GraphQL */ `
  mutation UpdateProductCategory(
    $input: UpdateProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    updateProductCategory(input: $input, condition: $condition) {
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
export const deleteProductCategory = /* GraphQL */ `
  mutation DeleteProductCategory(
    $input: DeleteProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    deleteProductCategory(input: $input, condition: $condition) {
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
export const createChainProduct = /* GraphQL */ `
  mutation CreateChainProduct(
    $input: CreateChainProductInput!
    $condition: ModelChainProductConditionInput
  ) {
    createChainProduct(input: $input, condition: $condition) {
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
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        refGroupPrice
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
export const updateChainProduct = /* GraphQL */ `
  mutation UpdateChainProduct(
    $input: UpdateChainProductInput!
    $condition: ModelChainProductConditionInput
  ) {
    updateChainProduct(input: $input, condition: $condition) {
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
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        refGroupPrice
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
export const deleteChainProduct = /* GraphQL */ `
  mutation DeleteChainProduct(
    $input: DeleteChainProductInput!
    $condition: ModelChainProductConditionInput
  ) {
    deleteChainProduct(input: $input, condition: $condition) {
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
        variantName {
          en
          de
          hu
        }
        pack {
          size
          unit
        }
        refGroupPrice
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
export const createUnit = /* GraphQL */ `
  mutation CreateUnit(
    $input: CreateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    createUnit(input: $input, condition: $condition) {
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
        override {
          date
          from
          to
        }
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const updateUnit = /* GraphQL */ `
  mutation UpdateUnit(
    $input: UpdateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    updateUnit(input: $input, condition: $condition) {
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
        override {
          date
          from
          to
        }
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const deleteUnit = /* GraphQL */ `
  mutation DeleteUnit(
    $input: DeleteUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    deleteUnit(input: $input, condition: $condition) {
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
        override {
          date
          from
          to
        }
      }
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
