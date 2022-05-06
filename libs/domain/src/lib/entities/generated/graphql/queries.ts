/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listStripeCards = /* GraphQL */ `
  query ListStripeCards {
    listStripeCards {
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
export const getUnitsNearLocation = /* GraphQL */ `
  query GetUnitsNearLocation($input: GetUnitsNearLocationInput!) {
    getUnitsNearLocation(input: $input) {
      items {
        id
        groupId
        chainId
        name
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
        paymentModes {
          type
          caption
          method
        }
        distance
        currency
        isAcceptingOrders
        openingHours
        openingHoursNext7 {
          date
          closed
          from
          to
        }
        supportedServingModes
        supportedOrderModes
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
        unit {
          id
          adBanners {
            imageUrl
          }
          adBannersEnabled
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
            lon
          }
          createdAt
          updatedAt
        }
        chain {
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
            }
          }
          email
          phone
          createdAt
          updatedAt
        }
        group {
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
        createdAt
        updatedAt
      }
    }
  }
`;
export const searchByRadius = /* GraphQL */ `
  query SearchByRadius($input: SearchByRadiusInput!) {
    searchByRadius(input: $input) {
      items
      nextToken
      total
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
      deletedAt
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
        deletedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchChainProducts = /* GraphQL */ `
  query SearchChainProducts(
    $filter: SearchableChainProductFilterInput
    $sort: [SearchableChainProductSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableChainProductAggregationInput]
  ) {
    searchChainProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
        deletedAt
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
      deletedAt
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
        deletedAt
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchGroupProducts = /* GraphQL */ `
  query SearchGroupProducts(
    $filter: SearchableGroupProductFilterInput
    $sort: [SearchableGroupProductSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGroupProductAggregationInput]
  ) {
    searchGroupProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
        deletedAt
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
      nextToken
    }
  }
`;
export const searchUnitProducts = /* GraphQL */ `
  query SearchUnitProducts(
    $filter: SearchableUnitProductFilterInput
    $sort: [SearchableUnitProductSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUnitProductAggregationInput]
  ) {
    searchUnitProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
      nextToken
    }
  }
`;
export const searchAdminUsers = /* GraphQL */ `
  query SearchAdminUsers(
    $filter: SearchableAdminUserFilterInput
    $sort: [SearchableAdminUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableAdminUserAggregationInput]
  ) {
    searchAdminUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
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
export const searchChains = /* GraphQL */ `
  query SearchChains(
    $filter: SearchableChainFilterInput
    $sort: [SearchableChainSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableChainAggregationInput]
  ) {
    searchChains(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
          }
        }
        email
        phone
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
export const searchGroups = /* GraphQL */ `
  query SearchGroups(
    $filter: SearchableGroupFilterInput
    $sort: [SearchableGroupSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGroupAggregationInput]
  ) {
    searchGroups(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
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
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getOrder = /* GraphQL */ `
  query GetOrder($id: ID!) {
    getOrder(id: $id) {
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
      currentStatus
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
        currentStatus
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchOrders = /* GraphQL */ `
  query SearchOrders(
    $filter: SearchableOrderFilterInput
    $sort: [SearchableOrderSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableOrderAggregationInput]
  ) {
    searchOrders(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
        currentStatus
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
export const listProductCategories = /* GraphQL */ `
  query ListProductCategories(
    $filter: ModelProductCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductCategories(
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
export const searchProductCategories = /* GraphQL */ `
  query SearchProductCategories(
    $filter: SearchableProductCategoryFilterInput
    $sort: [SearchableProductCategorySortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableProductCategoryAggregationInput]
  ) {
    searchProductCategories(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
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
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getProductComponent = /* GraphQL */ `
  query GetProductComponent($id: ID!) {
    getProductComponent(id: $id) {
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
export const listProductComponents = /* GraphQL */ `
  query ListProductComponents(
    $filter: ModelProductComponentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductComponents(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const searchProductComponents = /* GraphQL */ `
  query SearchProductComponents(
    $filter: SearchableProductComponentFilterInput
    $sort: [SearchableProductComponentSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableProductComponentAggregationInput]
  ) {
    searchProductComponents(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getProductComponentSet = /* GraphQL */ `
  query GetProductComponentSet($id: ID!) {
    getProductComponentSet(id: $id) {
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
export const listProductComponentSets = /* GraphQL */ `
  query ListProductComponentSets(
    $filter: ModelProductComponentSetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProductComponentSets(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const searchProductComponentSets = /* GraphQL */ `
  query SearchProductComponentSets(
    $filter: SearchableProductComponentSetFilterInput
    $sort: [SearchableProductComponentSetSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableProductComponentSetAggregationInput]
  ) {
    searchProductComponentSets(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getGeneratedProductCategory = /* GraphQL */ `
  query GetGeneratedProductCategory($id: ID!) {
    getGeneratedProductCategory(id: $id) {
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
export const listGeneratedProductCategories = /* GraphQL */ `
  query ListGeneratedProductCategories(
    $filter: ModelGeneratedProductCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeneratedProductCategories(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
export const searchGeneratedProductCategories = /* GraphQL */ `
  query SearchGeneratedProductCategories(
    $filter: SearchableGeneratedProductCategoryFilterInput
    $sort: [SearchableGeneratedProductCategorySortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGeneratedProductCategoryAggregationInput]
  ) {
    searchGeneratedProductCategories(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
      nextToken
    }
  }
`;
export const searchGeneratedProducts = /* GraphQL */ `
  query SearchGeneratedProducts(
    $filter: SearchableGeneratedProductFilterInput
    $sort: [SearchableGeneratedProductSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableGeneratedProductAggregationInput]
  ) {
    searchGeneratedProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getFavoriteProduct = /* GraphQL */ `
  query GetFavoriteProduct($id: ID!) {
    getFavoriteProduct(id: $id) {
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
      nextToken
    }
  }
`;
export const searchFavoriteProducts = /* GraphQL */ `
  query SearchFavoriteProducts(
    $filter: SearchableFavoriteProductFilterInput
    $sort: [SearchableFavoriteProductSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableFavoriteProductAggregationInput]
  ) {
    searchFavoriteProducts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getUnit = /* GraphQL */ `
  query GetUnit($id: ID!) {
    getUnit(id: $id) {
      id
      adBanners {
        imageUrl
      }
      adBannersEnabled
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
        lon
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
        adBanners {
          imageUrl
        }
        adBannersEnabled
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
          lon
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const searchUnits = /* GraphQL */ `
  query SearchUnits(
    $filter: SearchableUnitFilterInput
    $sort: [SearchableUnitSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUnitAggregationInput]
  ) {
    searchUnits(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        adBanners {
          imageUrl
        }
        adBannersEnabled
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
          lon
        }
        createdAt
        updatedAt
      }
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
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
      nextToken
    }
  }
`;
export const searchUsers = /* GraphQL */ `
  query SearchUsers(
    $filter: SearchableUserFilterInput
    $sort: [SearchableUserSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableUserAggregationInput]
  ) {
    searchUsers(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getCart = /* GraphQL */ `
  query GetCart($id: ID!) {
    getCart(id: $id) {
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
export const listCarts = /* GraphQL */ `
  query ListCarts(
    $filter: ModelCartFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCarts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const searchCarts = /* GraphQL */ `
  query SearchCarts(
    $filter: SearchableCartFilterInput
    $sort: [SearchableCartSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableCartAggregationInput]
  ) {
    searchCarts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getTransaction = /* GraphQL */ `
  query GetTransaction($id: ID!) {
    getTransaction(id: $id) {
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
export const listTransactions = /* GraphQL */ `
  query ListTransactions(
    $filter: ModelTransactionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTransactions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const searchTransactions = /* GraphQL */ `
  query SearchTransactions(
    $filter: SearchableTransactionFilterInput
    $sort: [SearchableTransactionSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableTransactionAggregationInput]
  ) {
    searchTransactions(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getInvoice = /* GraphQL */ `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
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
export const listInvoices = /* GraphQL */ `
  query ListInvoices(
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const searchInvoices = /* GraphQL */ `
  query SearchInvoices(
    $filter: SearchableInvoiceFilterInput
    $sort: [SearchableInvoiceSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableInvoiceAggregationInput]
  ) {
    searchInvoices(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getReceipt = /* GraphQL */ `
  query GetReceipt($id: ID!) {
    getReceipt(id: $id) {
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
export const listReceipts = /* GraphQL */ `
  query ListReceipts(
    $filter: ModelReceiptFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReceipts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const searchReceipts = /* GraphQL */ `
  query SearchReceipts(
    $filter: SearchableReceiptFilterInput
    $sort: [SearchableReceiptSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableReceiptAggregationInput]
  ) {
    searchReceipts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
