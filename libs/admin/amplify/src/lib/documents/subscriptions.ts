/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onAdminUserChange = /* GraphQL */ `
  subscription OnAdminUserChange($id: ID!) {
    onAdminUserChange(id: $id) {
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
      createdAt
      updatedAt
    }
  }
`;
export const onAdminUsersChange = /* GraphQL */ `
  subscription OnAdminUsersChange {
    onAdminUsersChange {
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
      createdAt
      updatedAt
    }
  }
`;
export const onChainsChange = /* GraphQL */ `
  subscription OnChainsChange {
    onChainsChange {
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
      createdAt
      updatedAt
    }
  }
`;
export const onGroupsChange = /* GraphQL */ `
  subscription OnGroupsChange {
    onGroupsChange {
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
      createdAt
      updatedAt
    }
  }
`;
export const onUnitsChange = /* GraphQL */ `
  subscription OnUnitsChange {
    onUnitsChange {
      id
      groupId
      chainId
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
      createdAt
      updatedAt
    }
  }
`;
export const onUsersChange = /* GraphQL */ `
  subscription OnUsersChange {
    onUsersChange {
      id
      name
      email
      phone
      profileImage
      login
      createdAt
      updatedAt
    }
  }
`;
export const onProductCategoriesChange = /* GraphQL */ `
  subscription OnProductCategoriesChange {
    onProductCategoriesChange {
      id
      chainId
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
export const onChainProductChange = /* GraphQL */ `
  subscription OnChainProductChange {
    onChainProductChange {
      id
      chainId
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
      isVisible
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
        position
      }
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
        location {
          lat
          lng
        }
      }
      email
      phone
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
        location {
          lat
          lng
        }
      }
      email
      phone
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
        location {
          lat
          lng
        }
      }
      email
      phone
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
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProductCategory = /* GraphQL */ `
  subscription OnCreateProductCategory {
    onCreateProductCategory {
      id
      chainId
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
export const onUpdateProductCategory = /* GraphQL */ `
  subscription OnUpdateProductCategory {
    onUpdateProductCategory {
      id
      chainId
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
export const onDeleteProductCategory = /* GraphQL */ `
  subscription OnDeleteProductCategory {
    onDeleteProductCategory {
      id
      chainId
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
export const onCreateChainProduct = /* GraphQL */ `
  subscription OnCreateChainProduct {
    onCreateChainProduct {
      id
      chainId
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
      isVisible
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
        position
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChainProduct = /* GraphQL */ `
  subscription OnUpdateChainProduct {
    onUpdateChainProduct {
      id
      chainId
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
      isVisible
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
        position
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChainProduct = /* GraphQL */ `
  subscription OnDeleteChainProduct {
    onDeleteChainProduct {
      id
      chainId
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
      isVisible
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
        position
      }
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
      chainId
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
      chainId
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
      chainId
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
      createdAt
      updatedAt
    }
  }
`;
