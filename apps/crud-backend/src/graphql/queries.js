/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
        email
        phone
        profileImage
        settings {
          selectedChainId
          selectedGroupId
          selectedUnitId
          selectedProductCategoryId
          selectedLanguage
          selectedHistoryDate
        }
        createdAt
        updatedAt
        roleContexts {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getAdminUser = /* GraphQL */ `
  query GetAdminUser($id: ID!) {
    getAdminUser(id: $id) {
      id
      name
      email
      phone
      profileImage
      settings {
        selectedChainId
        selectedGroupId
        selectedUnitId
        selectedProductCategoryId
        selectedLanguage
        selectedHistoryDate
      }
      createdAt
      updatedAt
      roleContexts {
        items {
          id
          roleContextId
          adminUserId
          createdAt
          updatedAt
        }
        nextToken
      }
    }
  }
`;
export const getAdminRoleContext = /* GraphQL */ `
  query GetAdminRoleContext($id: ID!) {
    getAdminRoleContext(id: $id) {
      id
      roleContextId
      adminUserId
      createdAt
      updatedAt
      adminUser {
        id
        name
        email
        phone
        profileImage
        settings {
          selectedChainId
          selectedGroupId
          selectedUnitId
          selectedProductCategoryId
          selectedLanguage
          selectedHistoryDate
        }
        createdAt
        updatedAt
        roleContexts {
          nextToken
        }
      }
      roleContext {
        id
        contextId
        role
        name {
          en
          de
          hu
        }
        chainId
        groupId
        unitId
        createdAt
        updatedAt
        adminUsers {
          nextToken
        }
      }
    }
  }
`;
export const listAdminRoleContexts = /* GraphQL */ `
  query ListAdminRoleContexts(
    $filter: ModelAdminRoleContextFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAdminRoleContexts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        roleContextId
        adminUserId
        createdAt
        updatedAt
        adminUser {
          id
          name
          email
          phone
          profileImage
          createdAt
          updatedAt
        }
        roleContext {
          id
          contextId
          role
          chainId
          groupId
          unitId
          createdAt
          updatedAt
        }
      }
      nextToken
    }
  }
`;
export const listRoleContexts = /* GraphQL */ `
  query ListRoleContexts(
    $filter: ModelRoleContextFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoleContexts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        contextId
        role
        name {
          en
          de
          hu
        }
        chainId
        groupId
        unitId
        createdAt
        updatedAt
        adminUsers {
          nextToken
        }
      }
      nextToken
    }
  }
`;
export const getRoleContext = /* GraphQL */ `
  query GetRoleContext($id: ID!) {
    getRoleContext(id: $id) {
      id
      contextId
      role
      name {
        en
        de
        hu
      }
      chainId
      groupId
      unitId
      createdAt
      updatedAt
      adminUsers {
        items {
          id
          roleContextId
          adminUserId
          createdAt
          updatedAt
        }
        nextToken
      }
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
        isActive
        address {
          address
          city
          country
          title
          postalCode
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
      userId
      unitId
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
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
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
      }
      paymentMode {
        name
        caption
        method
      }
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
        userId
        unitId
        items {
          productId
          variantId
          created
          image
          quantity
          laneId
        }
        paymentMode {
          name
          caption
          method
        }
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
export const getOrderHistory = /* GraphQL */ `
  query GetOrderHistory($id: ID!) {
    getOrderHistory(id: $id) {
      id
      userId
      unitId
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
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
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
      }
      paymentMode {
        name
        caption
        method
      }
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
      place {
        seat
        table
      }
      paymentIntention
      status
      createdAt
      updatedAt
    }
  }
`;
export const listOrderHistorys = /* GraphQL */ `
  query ListOrderHistorys(
    $filter: ModelOrderHistoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listOrderHistorys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        unitId
        items {
          productId
          variantId
          created
          image
          quantity
          laneId
        }
        paymentMode {
          name
          caption
          method
        }
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
        place {
          seat
          table
        }
        paymentIntention
        status
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
      allergens
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
        image
        variants {
          id
          refGroupPrice
          isAvailable
          price
          position
        }
        allergens
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGroupProduct = /* GraphQL */ `
  query GetGroupProduct($id: ID!) {
    getGroupProduct(id: $id) {
      id
      parentId
      chainId
      groupId
      isVisible
      tax
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
export const listGroupProducts = /* GraphQL */ `
  query ListGroupProducts(
    $filter: ModelGroupProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGroupProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        parentId
        chainId
        groupId
        isVisible
        tax
        variants {
          id
          refGroupPrice
          isAvailable
          price
          position
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getUnitProduct = /* GraphQL */ `
  query GetUnitProduct($id: ID!) {
    getUnitProduct(id: $id) {
      id
      parentId
      chainId
      groupId
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
export const listUnitProducts = /* GraphQL */ `
  query ListUnitProducts(
    $filter: ModelUnitProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUnitProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        parentId
        chainId
        groupId
        unitId
        isVisible
        takeaway
        laneId
        position
        variants {
          id
          refGroupPrice
          isAvailable
          price
          position
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const listGeneratedProducts = /* GraphQL */ `
  query ListGeneratedProducts(
    $filter: ModelGeneratedProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeneratedProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        position
        image
        variants {
          id
          refGroupPrice
          isAvailable
          price
          position
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGeneratedProduct = /* GraphQL */ `
  query GetGeneratedProduct($id: ID!) {
    getGeneratedProduct(id: $id) {
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
export const getFavoriteProduct = /* GraphQL */ `
  query GetFavoriteProduct($id: ID!) {
    getFavoriteProduct(id: $id) {
      id
      userId
      unitId
      createdAt
      updatedAt
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
        position
        image
        variants {
          id
          refGroupPrice
          isAvailable
          price
          position
        }
        createdAt
        updatedAt
      }
    }
  }
`;
export const listFavoriteProducts = /* GraphQL */ `
  query ListFavoriteProducts(
    $filter: ModelFavoriteProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFavoriteProducts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        unitId
        createdAt
        updatedAt
        product {
          id
          unitId
          productCategoryId
          productType
          tax
          position
          image
          createdAt
          updatedAt
        }
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
        custom {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getCart = /* GraphQL */ `
  query GetCart($id: ID!) {
    getCart(id: $id) {
      id
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        name
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
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
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
      }
      createdAt
      updatedAt
    }
  }
`;
export const listCarts = /* GraphQL */ `
  query ListCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        unitId
        takeAway
        place {
          seat
          table
        }
        paymentMode {
          name
          caption
          method
        }
        items {
          productId
          variantId
          created
          image
          quantity
          laneId
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
