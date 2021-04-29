/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onAdminUserChange = /* GraphQL */ `
  subscription OnAdminUserChange($id: ID!) {
    onAdminUserChange(id: $id) {
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
export const onAdminUsersChange = /* GraphQL */ `
  subscription OnAdminUsersChange {
    onAdminUsersChange {
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
export const onRoleContextsChange = /* GraphQL */ `
  subscription OnRoleContextsChange {
    onRoleContextsChange {
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
export const onAdminRoleContextsChange = /* GraphQL */ `
  subscription OnAdminRoleContextsChange {
    onAdminRoleContextsChange {
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
export const onGroupProductChange = /* GraphQL */ `
  subscription OnGroupProductChange {
    onGroupProductChange {
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
export const onUnitProductChange = /* GraphQL */ `
  subscription OnUnitProductChange {
    onUnitProductChange {
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
export const onProductChanged = /* GraphQL */ `
  subscription OnProductChanged($unitId: String) {
    onProductChanged(unitId: $unitId) {
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
export const onOrderChanged = /* GraphQL */ `
  subscription OnOrderChanged($userId: String, $unitId: String) {
    onOrderChanged(userId: $userId, unitId: $unitId) {
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
export const onOrderHistoryChanged = /* GraphQL */ `
  subscription OnOrderHistoryChanged($userId: String, $unitId: String) {
    onOrderHistoryChanged(userId: $userId, unitId: $unitId) {
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
export const onCreateAdminUser = /* GraphQL */ `
  subscription OnCreateAdminUser {
    onCreateAdminUser {
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
export const onUpdateAdminUser = /* GraphQL */ `
  subscription OnUpdateAdminUser {
    onUpdateAdminUser {
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
export const onDeleteAdminUser = /* GraphQL */ `
  subscription OnDeleteAdminUser {
    onDeleteAdminUser {
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
export const onCreateAdminRoleContext = /* GraphQL */ `
  subscription OnCreateAdminRoleContext {
    onCreateAdminRoleContext {
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
export const onUpdateAdminRoleContext = /* GraphQL */ `
  subscription OnUpdateAdminRoleContext {
    onUpdateAdminRoleContext {
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
export const onDeleteAdminRoleContext = /* GraphQL */ `
  subscription OnDeleteAdminRoleContext {
    onDeleteAdminRoleContext {
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
export const onCreateRoleContext = /* GraphQL */ `
  subscription OnCreateRoleContext {
    onCreateRoleContext {
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
export const onUpdateRoleContext = /* GraphQL */ `
  subscription OnUpdateRoleContext {
    onUpdateRoleContext {
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
export const onDeleteRoleContext = /* GraphQL */ `
  subscription OnDeleteRoleContext {
    onDeleteRoleContext {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder {
    onDeleteOrder {
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
export const onCreateOrderHistory = /* GraphQL */ `
  subscription OnCreateOrderHistory {
    onCreateOrderHistory {
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
export const onUpdateOrderHistory = /* GraphQL */ `
  subscription OnUpdateOrderHistory {
    onUpdateOrderHistory {
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
export const onDeleteOrderHistory = /* GraphQL */ `
  subscription OnDeleteOrderHistory {
    onDeleteOrderHistory {
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
export const onCreateGroupProduct = /* GraphQL */ `
  subscription OnCreateGroupProduct {
    onCreateGroupProduct {
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
export const onUpdateGroupProduct = /* GraphQL */ `
  subscription OnUpdateGroupProduct {
    onUpdateGroupProduct {
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
export const onDeleteGroupProduct = /* GraphQL */ `
  subscription OnDeleteGroupProduct {
    onDeleteGroupProduct {
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
export const onCreateUnitProduct = /* GraphQL */ `
  subscription OnCreateUnitProduct {
    onCreateUnitProduct {
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
export const onUpdateUnitProduct = /* GraphQL */ `
  subscription OnUpdateUnitProduct {
    onUpdateUnitProduct {
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
export const onDeleteUnitProduct = /* GraphQL */ `
  subscription OnDeleteUnitProduct {
    onDeleteUnitProduct {
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
export const onCreateGeneratedProduct = /* GraphQL */ `
  subscription OnCreateGeneratedProduct {
    onCreateGeneratedProduct {
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
export const onUpdateGeneratedProduct = /* GraphQL */ `
  subscription OnUpdateGeneratedProduct {
    onUpdateGeneratedProduct {
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
export const onDeleteGeneratedProduct = /* GraphQL */ `
  subscription OnDeleteGeneratedProduct {
    onDeleteGeneratedProduct {
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
export const onCreateFavoriteProduct = /* GraphQL */ `
  subscription OnCreateFavoriteProduct {
    onCreateFavoriteProduct {
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
export const onUpdateFavoriteProduct = /* GraphQL */ `
  subscription OnUpdateFavoriteProduct {
    onUpdateFavoriteProduct {
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
export const onDeleteFavoriteProduct = /* GraphQL */ `
  subscription OnDeleteFavoriteProduct {
    onDeleteFavoriteProduct {
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
export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart {
    onCreateCart {
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
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart {
    onUpdateCart {
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
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart {
    onDeleteCart {
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
