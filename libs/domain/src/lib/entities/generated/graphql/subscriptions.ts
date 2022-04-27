/* tslint:disable */
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
export const onGroupsChange = /* GraphQL */ `
  subscription OnGroupsChange($chainId: ID!) {
    onGroupsChange(chainId: $chainId) {
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
export const onUnitsChange = /* GraphQL */ `
  subscription OnUnitsChange($groupId: ID!) {
    onUnitsChange(groupId: $groupId) {
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
export const onProductCategoriesChange = /* GraphQL */ `
  subscription OnProductCategoriesChange($chainId: ID!) {
    onProductCategoriesChange(chainId: $chainId) {
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
export const onProductComponentsChange = /* GraphQL */ `
  subscription OnProductComponentsChange($chainId: ID!) {
    onProductComponentsChange(chainId: $chainId) {
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
export const onProductComponentSetsChange = /* GraphQL */ `
  subscription OnProductComponentSetsChange($chainId: ID!) {
    onProductComponentSetsChange(chainId: $chainId) {
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
export const onChainProductChange = /* GraphQL */ `
  subscription OnChainProductChange($chainId: ID!) {
    onChainProductChange(chainId: $chainId) {
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
export const onGroupProductChange = /* GraphQL */ `
  subscription OnGroupProductChange($groupId: ID!) {
    onGroupProductChange(groupId: $groupId) {
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
export const onUnitProductChange = /* GraphQL */ `
  subscription OnUnitProductChange($unitId: ID!) {
    onUnitProductChange(unitId: $unitId) {
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
export const onGeneratedProductChange = /* GraphQL */ `
  subscription OnGeneratedProductChange($unitId: ID!) {
    onGeneratedProductChange(unitId: $unitId) {
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
export const onOrdersChange = /* GraphQL */ `
  subscription OnOrdersChange {
    onOrdersChange {
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
export const onOrdersDelete = /* GraphQL */ `
  subscription OnOrdersDelete {
    onOrdersDelete {
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
export const onOrderChanged = /* GraphQL */ `
  subscription OnOrderChanged(
    $userId: String
    $unitId: String
    $archived: Boolean
  ) {
    onOrderChanged(userId: $userId, unitId: $unitId, archived: $archived) {
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
export const onUnitOrdersChange = /* GraphQL */ `
  subscription OnUnitOrdersChange($unitId: String, $archived: Boolean) {
    onUnitOrdersChange(unitId: $unitId, archived: $archived) {
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
export const onCreateGroupProduct = /* GraphQL */ `
  subscription OnCreateGroupProduct {
    onCreateGroupProduct {
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
export const onUpdateGroupProduct = /* GraphQL */ `
  subscription OnUpdateGroupProduct {
    onUpdateGroupProduct {
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
export const onDeleteGroupProduct = /* GraphQL */ `
  subscription OnDeleteGroupProduct {
    onDeleteGroupProduct {
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
export const onUpdateOrder = /* GraphQL */ `
  subscription OnUpdateOrder {
    onUpdateOrder {
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
export const onDeleteOrder = /* GraphQL */ `
  subscription OnDeleteOrder {
    onDeleteOrder {
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
export const onCreateProductComponent = /* GraphQL */ `
  subscription OnCreateProductComponent {
    onCreateProductComponent {
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
export const onUpdateProductComponent = /* GraphQL */ `
  subscription OnUpdateProductComponent {
    onUpdateProductComponent {
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
export const onDeleteProductComponent = /* GraphQL */ `
  subscription OnDeleteProductComponent {
    onDeleteProductComponent {
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
export const onCreateProductComponentSet = /* GraphQL */ `
  subscription OnCreateProductComponentSet {
    onCreateProductComponentSet {
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
export const onUpdateProductComponentSet = /* GraphQL */ `
  subscription OnUpdateProductComponentSet {
    onUpdateProductComponentSet {
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
export const onDeleteProductComponentSet = /* GraphQL */ `
  subscription OnDeleteProductComponentSet {
    onDeleteProductComponentSet {
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
export const onCreateGeneratedProductCategory = /* GraphQL */ `
  subscription OnCreateGeneratedProductCategory {
    onCreateGeneratedProductCategory {
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
export const onUpdateGeneratedProductCategory = /* GraphQL */ `
  subscription OnUpdateGeneratedProductCategory {
    onUpdateGeneratedProductCategory {
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
export const onDeleteGeneratedProductCategory = /* GraphQL */ `
  subscription OnDeleteGeneratedProductCategory {
    onDeleteGeneratedProductCategory {
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
export const onCreateFavoriteProduct = /* GraphQL */ `
  subscription OnCreateFavoriteProduct {
    onCreateFavoriteProduct {
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
export const onUpdateFavoriteProduct = /* GraphQL */ `
  subscription OnUpdateFavoriteProduct {
    onUpdateFavoriteProduct {
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
export const onDeleteFavoriteProduct = /* GraphQL */ `
  subscription OnDeleteFavoriteProduct {
    onDeleteFavoriteProduct {
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
export const onDeleteUnit = /* GraphQL */ `
  subscription OnDeleteUnit {
    onDeleteUnit {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateCart = /* GraphQL */ `
  subscription OnCreateCart {
    onCreateCart {
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
export const onUpdateCart = /* GraphQL */ `
  subscription OnUpdateCart {
    onUpdateCart {
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
export const onDeleteCart = /* GraphQL */ `
  subscription OnDeleteCart {
    onDeleteCart {
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
export const onCreateTransaction = /* GraphQL */ `
  subscription OnCreateTransaction {
    onCreateTransaction {
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
export const onUpdateTransaction = /* GraphQL */ `
  subscription OnUpdateTransaction {
    onUpdateTransaction {
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
export const onDeleteTransaction = /* GraphQL */ `
  subscription OnDeleteTransaction {
    onDeleteTransaction {
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
export const onCreateInvoice = /* GraphQL */ `
  subscription OnCreateInvoice {
    onCreateInvoice {
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
export const onUpdateInvoice = /* GraphQL */ `
  subscription OnUpdateInvoice {
    onUpdateInvoice {
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
export const onDeleteInvoice = /* GraphQL */ `
  subscription OnDeleteInvoice {
    onDeleteInvoice {
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
export const onCreateReceipt = /* GraphQL */ `
  subscription OnCreateReceipt {
    onCreateReceipt {
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
export const onUpdateReceipt = /* GraphQL */ `
  subscription OnUpdateReceipt {
    onUpdateReceipt {
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
export const onDeleteReceipt = /* GraphQL */ `
  subscription OnDeleteReceipt {
    onDeleteReceipt {
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
