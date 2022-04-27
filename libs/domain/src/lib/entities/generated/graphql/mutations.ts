/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUnit = /* GraphQL */ `
  mutation CreateUnit($input: CreateUnitInput!) {
    createUnit(input: $input) {
      id
      groupId
      chainId
      lastOrderNum
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
          lon
        }
      }
      email
      phone
      paymentModes {
        type
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
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lng
        lon
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUnit = /* GraphQL */ `
  mutation UpdateUnit($input: UpdateUnitInput!) {
    updateUnit(input: $input) {
      id
      groupId
      chainId
      lastOrderNum
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
          lon
        }
      }
      email
      phone
      paymentModes {
        type
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
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lng
        lon
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUnitRKeeperData = /* GraphQL */ `
  mutation UpdateUnitRKeeperData($input: UpdateRKeeperDataInput!) {
    updateUnitRKeeperData(input: $input) {
      id
      groupId
      chainId
      lastOrderNum
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
          lon
        }
      }
      email
      phone
      paymentModes {
        type
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
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lng
        lon
      }
      createdAt
      updatedAt
    }
  }
`;
export const createAdminUser = /* GraphQL */ `
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input) {
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
    }
  }
`;
export const deleteAdminUser = /* GraphQL */ `
  mutation DeleteAdminUser($input: DeleteAdminUserInput!) {
    deleteAdminUser(input: $input) {
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
    }
  }
`;
export const createAnonymUser = /* GraphQL */ `
  mutation CreateAnonymUser {
    createAnonymUser {
      username
      pwd
    }
  }
`;
export const createOrderFromCart = /* GraphQL */ `
  mutation CreateOrderFromCart($input: CreateOrderFromCartInput!) {
    createOrderFromCart(input: $input)
  }
`;
export const createOrder = /* GraphQL */ `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      version
      userId
      unitId
      orderNum
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      paymentMode {
        type
        caption
        method
      }
      statusLog {
        userId
        status
        ts
      }
      archived
      place {
        seat
        table
      }
      paymentIntention
      transactionStatus
      transactionId
      transaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      unpayCategory
      orderMode
      servingMode
      serviceFee {
        currency
        grossPrice
        taxContent
      }
      packagingSum {
        currency
        netPrice
        taxPercentage
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      rating {
        key
        value
      }
      hasRated
      tip {
        type
        value
      }
      tipTransactionStatus
      tipTransactionId
      tipTransaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      packagingFeeTaxPercentage
      externalId
      guestLabel
      createdAt
      updatedAt
    }
  }
`;
export const regenerateUnitData = /* GraphQL */ `
  mutation RegenerateUnitData($input: RegenerateUnitDataInput!) {
    regenerateUnitData(input: $input)
  }
`;
export const startStripePayment = /* GraphQL */ `
  mutation StartStripePayment($input: StartStripePaymentInput!) {
    startStripePayment(input: $input) {
      clientSecret
      status
      paymentMethodId
      stripeAccount
    }
  }
`;
export const payTipWithStripe = /* GraphQL */ `
  mutation PayTipWithStripe($input: PayTipWithStripeInput!) {
    payTipWithStripe(input: $input) {
      clientSecret
      status
      paymentMethodId
      stripeAccount
    }
  }
`;
export const createStripeCard = /* GraphQL */ `
  mutation CreateStripeCard($input: StripeCardCreateInput!) {
    createStripeCard(input: $input) {
      id
      name
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
      billing_details {
        email
        name
        phone
        address {
          city
          country
          line1
          line2
          postal_code
          state
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateMyStripeCard = /* GraphQL */ `
  mutation UpdateMyStripeCard($input: StripeCardUpdateInput!) {
    updateMyStripeCard(input: $input) {
      id
      name
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
      billing_details {
        email
        name
        phone
        address {
          city
          country
          line1
          line2
          postal_code
          state
        }
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteMyStripeCard = /* GraphQL */ `
  mutation DeleteMyStripeCard($input: StripeCardDeleteInput!) {
    deleteMyStripeCard(input: $input)
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
        netPackagingFee
        soldOut
      }
      allergens
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
        netPackagingFee
        soldOut
      }
      allergens
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
        netPackagingFee
        soldOut
      }
      allergens
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
      takeawayTax
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
      takeawayTax
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
      takeawayTax
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      externalId
      dirty
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      supportedServingModes
      externalId
      dirty
      deletedAt
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      supportedServingModes
      externalId
      dirty
      deletedAt
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
        netPackagingFee
        soldOut
      }
      configSets {
        productSetId
        items {
          productComponentId
          refGroupPrice
          price
          position
          externalId
          netPackagingFee
        }
        position
      }
      supportedServingModes
      externalId
      dirty
      deletedAt
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
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
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
          lon
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
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
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
          lon
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
          indicator
          textLight
          textDark
          primary
          secondary
          button
          buttonText
          icon
          highlight
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
          lon
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
          lon
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
          lon
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
          lon
        }
      }
      email
      phone
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
      version
      userId
      unitId
      orderNum
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      paymentMode {
        type
        caption
        method
      }
      statusLog {
        userId
        status
        ts
      }
      archived
      place {
        seat
        table
      }
      paymentIntention
      transactionStatus
      transactionId
      transaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      unpayCategory
      orderMode
      servingMode
      serviceFee {
        currency
        grossPrice
        taxContent
      }
      packagingSum {
        currency
        netPrice
        taxPercentage
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      rating {
        key
        value
      }
      hasRated
      tip {
        type
        value
      }
      tipTransactionStatus
      tipTransactionId
      tipTransaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      packagingFeeTaxPercentage
      externalId
      guestLabel
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
      version
      userId
      unitId
      orderNum
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      paymentMode {
        type
        caption
        method
      }
      statusLog {
        userId
        status
        ts
      }
      archived
      place {
        seat
        table
      }
      paymentIntention
      transactionStatus
      transactionId
      transaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      unpayCategory
      orderMode
      servingMode
      serviceFee {
        currency
        grossPrice
        taxContent
      }
      packagingSum {
        currency
        netPrice
        taxPercentage
      }
      sumPriceShown {
        currency
        pricePerUnit
        priceSum
        tax
        taxSum
      }
      rating {
        key
        value
      }
      hasRated
      tip {
        type
        value
      }
      tipTransactionStatus
      tipTransactionId
      tipTransaction {
        id
        userId
        user {
          id
          name
          email
          phone
          profileImage
          stripeCustomerId
          invoiceAddress {
            customerName
            taxNumber
            country
            city
            streetAddress
            postalCode
            email
          }
          createdAt
          updatedAt
        }
        orderId
        type
        total
        currency
        status
        externalTransactionId
        invoiceId
        invoice {
          id
          userId
          orderId
          transactionId
          externalInvoiceId
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
          pdfUrl
          status
          createdAt
          updatedAt
        }
        receiptId
        receipt {
          id
          userId
          orderId
          transactionId
          externalReceiptId
          email
          pdfData
          status
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
        paymentMethodId
      }
      orderPolicy
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      packagingFeeTaxPercentage
      externalId
      guestLabel
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
export const createProductComponent = /* GraphQL */ `
  mutation CreateProductComponent(
    $input: CreateProductComponentInput!
    $condition: ModelProductComponentConditionInput
  ) {
    createProductComponent(input: $input, condition: $condition) {
      id
      chainId
      name {
        en
        de
        hu
      }
      description
      allergens
      externalId
      dirty
      soldOut
      createdAt
      updatedAt
    }
  }
`;
export const updateProductComponent = /* GraphQL */ `
  mutation UpdateProductComponent(
    $input: UpdateProductComponentInput!
    $condition: ModelProductComponentConditionInput
  ) {
    updateProductComponent(input: $input, condition: $condition) {
      id
      chainId
      name {
        en
        de
        hu
      }
      description
      allergens
      externalId
      dirty
      soldOut
      createdAt
      updatedAt
    }
  }
`;
export const deleteProductComponent = /* GraphQL */ `
  mutation DeleteProductComponent(
    $input: DeleteProductComponentInput!
    $condition: ModelProductComponentConditionInput
  ) {
    deleteProductComponent(input: $input, condition: $condition) {
      id
      chainId
      name {
        en
        de
        hu
      }
      description
      allergens
      externalId
      dirty
      soldOut
      createdAt
      updatedAt
    }
  }
`;
export const createProductComponentSet = /* GraphQL */ `
  mutation CreateProductComponentSet(
    $input: CreateProductComponentSetInput!
    $condition: ModelProductComponentSetConditionInput
  ) {
    createProductComponentSet(input: $input, condition: $condition) {
      id
      externalId
      chainId
      type
      name {
        en
        de
        hu
      }
      description
      items
      maxSelection
      supportedServingModes
      dirty
      createdAt
      updatedAt
    }
  }
`;
export const updateProductComponentSet = /* GraphQL */ `
  mutation UpdateProductComponentSet(
    $input: UpdateProductComponentSetInput!
    $condition: ModelProductComponentSetConditionInput
  ) {
    updateProductComponentSet(input: $input, condition: $condition) {
      id
      externalId
      chainId
      type
      name {
        en
        de
        hu
      }
      description
      items
      maxSelection
      supportedServingModes
      dirty
      createdAt
      updatedAt
    }
  }
`;
export const deleteProductComponentSet = /* GraphQL */ `
  mutation DeleteProductComponentSet(
    $input: DeleteProductComponentSetInput!
    $condition: ModelProductComponentSetConditionInput
  ) {
    deleteProductComponentSet(input: $input, condition: $condition) {
      id
      externalId
      chainId
      type
      name {
        en
        de
        hu
      }
      description
      items
      maxSelection
      supportedServingModes
      dirty
      createdAt
      updatedAt
    }
  }
`;
export const createGeneratedProductCategory = /* GraphQL */ `
  mutation CreateGeneratedProductCategory(
    $input: CreateGeneratedProductCategoryInput!
    $condition: ModelGeneratedProductCategoryConditionInput
  ) {
    createGeneratedProductCategory(input: $input, condition: $condition) {
      id
      unitId
      productNum
      productCategoryId
      productCategory {
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
      createdAt
      updatedAt
    }
  }
`;
export const updateGeneratedProductCategory = /* GraphQL */ `
  mutation UpdateGeneratedProductCategory(
    $input: UpdateGeneratedProductCategoryInput!
    $condition: ModelGeneratedProductCategoryConditionInput
  ) {
    updateGeneratedProductCategory(input: $input, condition: $condition) {
      id
      unitId
      productNum
      productCategoryId
      productCategory {
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
      createdAt
      updatedAt
    }
  }
`;
export const deleteGeneratedProductCategory = /* GraphQL */ `
  mutation DeleteGeneratedProductCategory(
    $input: DeleteGeneratedProductCategoryInput!
    $condition: ModelGeneratedProductCategoryConditionInput
  ) {
    deleteGeneratedProductCategory(input: $input, condition: $condition) {
      id
      unitId
      productNum
      productCategoryId
      productCategory {
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
      takeawayTax
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
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
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
      takeawayTax
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
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
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
      takeawayTax
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
        price
        netPackagingFee
        position
        soldOut
      }
      allergens
      configSets {
        productSetId
        name {
          en
          de
          hu
        }
        position
        type
        maxSelection
        items {
          productComponentId
          price
          position
          name {
            en
            de
            hu
          }
          allergens
          netPackagingFee
          soldOut
          externalId
        }
        supportedServingModes
      }
      supportedServingModes
      soldOut
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
        takeawayTax
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
          price
          netPackagingFee
          position
          soldOut
        }
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          position
          type
          maxSelection
          items {
            productComponentId
            price
            position
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            soldOut
            externalId
          }
          supportedServingModes
        }
        supportedServingModes
        soldOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      favoriteProductProductId
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
        takeawayTax
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
          price
          netPackagingFee
          position
          soldOut
        }
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          position
          type
          maxSelection
          items {
            productComponentId
            price
            position
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            soldOut
            externalId
          }
          supportedServingModes
        }
        supportedServingModes
        soldOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      favoriteProductProductId
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
        takeawayTax
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
          price
          netPackagingFee
          position
          soldOut
        }
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          position
          type
          maxSelection
          items {
            productComponentId
            price
            position
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            soldOut
            externalId
          }
          supportedServingModes
        }
        supportedServingModes
        soldOut
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      favoriteProductProductId
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
      lastOrderNum
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
          lon
        }
      }
      email
      phone
      paymentModes {
        type
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
      merchantId
      timeZone
      pos {
        type
        rkeeper {
          endpointUri
          rkeeperUsername
          rkeeperPassword
          anyuppUsername
          anyuppPassword
        }
      }
      externalId
      supportedServingModes
      supportedOrderModes
      orderPolicy
      packagingTaxPercentage
      serviceFeePolicy {
        type
        percentage
      }
      ratingPolicies {
        key
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        ratings {
          value
          text {
            en
            de
            hu
          }
          icon
        }
      }
      tipPolicy {
        title {
          en
          de
          hu
        }
        description {
          en
          de
          hu
        }
        percents
        minOtherAmount
      }
      soldOutVisibilityPolicy
      orderPaymentPolicy
      location {
        lat
        lng
        lon
      }
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
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
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
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
      }
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
      stripeCustomerId
      invoiceAddress {
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
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
      version
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        type
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      servingMode
      orderMode
      orderPolicy
      guestLabel
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
      version
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        type
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      servingMode
      orderMode
      orderPolicy
      guestLabel
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
      version
      userId
      unitId
      takeAway
      place {
        seat
        table
      }
      paymentMode {
        type
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
        allergens
        configSets {
          productSetId
          name {
            en
            de
            hu
          }
          type
          items {
            productComponentId
            price
            name {
              en
              de
              hu
            }
            allergens
            netPackagingFee
            externalId
          }
        }
        productType
        externalId
        netPackagingFee
        serviceFee {
          currency
          netPrice
          taxPercentage
        }
        priceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
        sumPriceShown {
          currency
          pricePerUnit
          priceSum
          tax
          taxSum
        }
      }
      servingMode
      orderMode
      orderPolicy
      guestLabel
      createdAt
      updatedAt
    }
  }
`;
export const createTransaction = /* GraphQL */ `
  mutation CreateTransaction(
    $input: CreateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    createTransaction(input: $input, condition: $condition) {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
  }
`;
export const updateTransaction = /* GraphQL */ `
  mutation UpdateTransaction(
    $input: UpdateTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    updateTransaction(input: $input, condition: $condition) {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
  }
`;
export const deleteTransaction = /* GraphQL */ `
  mutation DeleteTransaction(
    $input: DeleteTransactionInput!
    $condition: ModelTransactionConditionInput
  ) {
    deleteTransaction(input: $input, condition: $condition) {
      id
      userId
      user {
        id
        name
        email
        phone
        profileImage
        stripeCustomerId
        invoiceAddress {
          customerName
          taxNumber
          country
          city
          streetAddress
          postalCode
          email
        }
        createdAt
        updatedAt
      }
      orderId
      type
      total
      currency
      status
      externalTransactionId
      invoiceId
      invoice {
        id
        userId
        orderId
        transactionId
        externalInvoiceId
        customerName
        taxNumber
        country
        city
        streetAddress
        postalCode
        email
        pdfUrl
        status
        createdAt
        updatedAt
      }
      receiptId
      receipt {
        id
        userId
        orderId
        transactionId
        externalReceiptId
        email
        pdfData
        status
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      paymentMethodId
    }
  }
`;
export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice(
    $input: CreateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    createInvoice(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateInvoice = /* GraphQL */ `
  mutation UpdateInvoice(
    $input: UpdateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    updateInvoice(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteInvoice = /* GraphQL */ `
  mutation DeleteInvoice(
    $input: DeleteInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    deleteInvoice(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalInvoiceId
      customerName
      taxNumber
      country
      city
      streetAddress
      postalCode
      email
      pdfUrl
      status
      createdAt
      updatedAt
    }
  }
`;
export const createReceipt = /* GraphQL */ `
  mutation CreateReceipt(
    $input: CreateReceiptInput!
    $condition: ModelReceiptConditionInput
  ) {
    createReceipt(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateReceipt = /* GraphQL */ `
  mutation UpdateReceipt(
    $input: UpdateReceiptInput!
    $condition: ModelReceiptConditionInput
  ) {
    updateReceipt(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteReceipt = /* GraphQL */ `
  mutation DeleteReceipt(
    $input: DeleteReceiptInput!
    $condition: ModelReceiptConditionInput
  ) {
    deleteReceipt(input: $input, condition: $condition) {
      id
      userId
      orderId
      transactionId
      externalReceiptId
      email
      pdfData
      status
      createdAt
      updatedAt
    }
  }
`;
