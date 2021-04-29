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
export const updateAdminUser = /* GraphQL */ `
  mutation UpdateAdminUser(
    $input: UpdateAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    updateAdminUser(input: $input, condition: $condition) {
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
export const deleteAdminUser = /* GraphQL */ `
  mutation DeleteAdminUser(
    $input: DeleteAdminUserInput!
    $condition: ModelAdminUserConditionInput
  ) {
    deleteAdminUser(input: $input, condition: $condition) {
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
export const createAdminRoleContext = /* GraphQL */ `
  mutation CreateAdminRoleContext(
    $input: CreateAdminRoleContextInput!
    $condition: ModelAdminRoleContextConditionInput
  ) {
    createAdminRoleContext(input: $input, condition: $condition) {
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
export const updateAdminRoleContext = /* GraphQL */ `
  mutation UpdateAdminRoleContext(
    $input: UpdateAdminRoleContextInput!
    $condition: ModelAdminRoleContextConditionInput
  ) {
    updateAdminRoleContext(input: $input, condition: $condition) {
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
export const deleteAdminRoleContext = /* GraphQL */ `
  mutation DeleteAdminRoleContext(
    $input: DeleteAdminRoleContextInput!
    $condition: ModelAdminRoleContextConditionInput
  ) {
    deleteAdminRoleContext(input: $input, condition: $condition) {
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
export const createRoleContext = /* GraphQL */ `
  mutation CreateRoleContext(
    $input: CreateRoleContextInput!
    $condition: ModelRoleContextConditionInput
  ) {
    createRoleContext(input: $input, condition: $condition) {
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
export const updateRoleContext = /* GraphQL */ `
  mutation UpdateRoleContext(
    $input: UpdateRoleContextInput!
    $condition: ModelRoleContextConditionInput
  ) {
    updateRoleContext(input: $input, condition: $condition) {
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
export const deleteRoleContext = /* GraphQL */ `
  mutation DeleteRoleContext(
    $input: DeleteRoleContextInput!
    $condition: ModelRoleContextConditionInput
  ) {
    deleteRoleContext(input: $input, condition: $condition) {
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
export const updateOrder = /* GraphQL */ `
  mutation UpdateOrder(
    $input: UpdateOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    updateOrder(input: $input, condition: $condition) {
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
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $input: DeleteOrderInput!
    $condition: ModelOrderConditionInput
  ) {
    deleteOrder(input: $input, condition: $condition) {
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
export const createOrderHistory = /* GraphQL */ `
  mutation CreateOrderHistory(
    $input: CreateOrderHistoryInput!
    $condition: ModelOrderHistoryConditionInput
  ) {
    createOrderHistory(input: $input, condition: $condition) {
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
export const updateOrderHistory = /* GraphQL */ `
  mutation UpdateOrderHistory(
    $input: UpdateOrderHistoryInput!
    $condition: ModelOrderHistoryConditionInput
  ) {
    updateOrderHistory(input: $input, condition: $condition) {
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
export const deleteOrderHistory = /* GraphQL */ `
  mutation DeleteOrderHistory(
    $input: DeleteOrderHistoryInput!
    $condition: ModelOrderHistoryConditionInput
  ) {
    deleteOrderHistory(input: $input, condition: $condition) {
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
export const createProductCategory = /* GraphQL */ `
  mutation CreateProductCategory(
    $input: CreateProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    createProductCategory(input: $input, condition: $condition) {
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
export const updateProductCategory = /* GraphQL */ `
  mutation UpdateProductCategory(
    $input: UpdateProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    updateProductCategory(input: $input, condition: $condition) {
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
export const deleteProductCategory = /* GraphQL */ `
  mutation DeleteProductCategory(
    $input: DeleteProductCategoryInput!
    $condition: ModelProductCategoryConditionInput
  ) {
    deleteProductCategory(input: $input, condition: $condition) {
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
export const createChainProduct = /* GraphQL */ `
  mutation CreateChainProduct(
    $input: CreateChainProductInput!
    $condition: ModelChainProductConditionInput
  ) {
    createChainProduct(input: $input, condition: $condition) {
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
      createdAt
      updatedAt
    }
  }
`;
export const createGroupProduct = /* GraphQL */ `
  mutation CreateGroupProduct(
    $input: CreateGroupProductInput!
    $condition: ModelGroupProductConditionInput
  ) {
    createGroupProduct(input: $input, condition: $condition) {
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
export const updateGroupProduct = /* GraphQL */ `
  mutation UpdateGroupProduct(
    $input: UpdateGroupProductInput!
    $condition: ModelGroupProductConditionInput
  ) {
    updateGroupProduct(input: $input, condition: $condition) {
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
export const deleteGroupProduct = /* GraphQL */ `
  mutation DeleteGroupProduct(
    $input: DeleteGroupProductInput!
    $condition: ModelGroupProductConditionInput
  ) {
    deleteGroupProduct(input: $input, condition: $condition) {
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
export const createUnitProduct = /* GraphQL */ `
  mutation CreateUnitProduct(
    $input: CreateUnitProductInput!
    $condition: ModelUnitProductConditionInput
  ) {
    createUnitProduct(input: $input, condition: $condition) {
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
export const updateUnitProduct = /* GraphQL */ `
  mutation UpdateUnitProduct(
    $input: UpdateUnitProductInput!
    $condition: ModelUnitProductConditionInput
  ) {
    updateUnitProduct(input: $input, condition: $condition) {
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
export const deleteUnitProduct = /* GraphQL */ `
  mutation DeleteUnitProduct(
    $input: DeleteUnitProductInput!
    $condition: ModelUnitProductConditionInput
  ) {
    deleteUnitProduct(input: $input, condition: $condition) {
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
export const createGeneratedProduct = /* GraphQL */ `
  mutation CreateGeneratedProduct(
    $input: CreateGeneratedProductInput!
    $condition: ModelGeneratedProductConditionInput
  ) {
    createGeneratedProduct(input: $input, condition: $condition) {
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
export const updateGeneratedProduct = /* GraphQL */ `
  mutation UpdateGeneratedProduct(
    $input: UpdateGeneratedProductInput!
    $condition: ModelGeneratedProductConditionInput
  ) {
    updateGeneratedProduct(input: $input, condition: $condition) {
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
export const deleteGeneratedProduct = /* GraphQL */ `
  mutation DeleteGeneratedProduct(
    $input: DeleteGeneratedProductInput!
    $condition: ModelGeneratedProductConditionInput
  ) {
    deleteGeneratedProduct(input: $input, condition: $condition) {
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
export const createFavoriteProduct = /* GraphQL */ `
  mutation CreateFavoriteProduct(
    $input: CreateFavoriteProductInput!
    $condition: ModelFavoriteProductConditionInput
  ) {
    createFavoriteProduct(input: $input, condition: $condition) {
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
export const updateFavoriteProduct = /* GraphQL */ `
  mutation UpdateFavoriteProduct(
    $input: UpdateFavoriteProductInput!
    $condition: ModelFavoriteProductConditionInput
  ) {
    updateFavoriteProduct(input: $input, condition: $condition) {
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
export const deleteFavoriteProduct = /* GraphQL */ `
  mutation DeleteFavoriteProduct(
    $input: DeleteFavoriteProductInput!
    $condition: ModelFavoriteProductConditionInput
  ) {
    deleteFavoriteProduct(input: $input, condition: $condition) {
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
export const createUnit = /* GraphQL */ `
  mutation CreateUnit(
    $input: CreateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    createUnit(input: $input, condition: $condition) {
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
export const updateUnit = /* GraphQL */ `
  mutation UpdateUnit(
    $input: UpdateUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    updateUnit(input: $input, condition: $condition) {
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
export const deleteUnit = /* GraphQL */ `
  mutation DeleteUnit(
    $input: DeleteUnitInput!
    $condition: ModelUnitConditionInput
  ) {
    deleteUnit(input: $input, condition: $condition) {
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
export const createCart = /* GraphQL */ `
  mutation CreateCart(
    $input: CreateCartInput!
    $condition: ModelCartConditionInput
  ) {
    createCart(input: $input, condition: $condition) {
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
export const updateCart = /* GraphQL */ `
  mutation UpdateCart(
    $input: UpdateCartInput!
    $condition: ModelCartConditionInput
  ) {
    updateCart(input: $input, condition: $condition) {
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
export const deleteCart = /* GraphQL */ `
  mutation DeleteCart(
    $input: DeleteCartInput!
    $condition: ModelCartConditionInput
  ) {
    deleteCart(input: $input, condition: $condition) {
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
