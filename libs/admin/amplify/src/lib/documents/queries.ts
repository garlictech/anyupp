/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAdminUser = /* GraphQL */ `
  query GetAdminUser($id: ID!) {
    getAdminUser(id: $id) {
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
      nextToken
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
      nextToken
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
      nextToken
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
      nextToken
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProductCategory = /* GraphQL */ `
  query GetProductCategory($id: ID!) {
    getProductCategory(id: $id) {
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
      nextToken
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUnit = /* GraphQL */ `
  query GetUnit($id: ID!) {
    getUnit(id: $id) {
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
      nextToken
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
