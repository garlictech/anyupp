export const getGroupCurrency = /* GraphQL */ `
  query GetGroupCurrency($id: ID!) {
    getGroup(id: $id) {
      currency
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
        createdAt
        updatedAt
        roleContexts {
          items {
            id
            roleContextId
            adminUserId
            createdAt
            updatedAt
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
            }
          }
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
          }
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
        createdAt
        updatedAt
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
          }
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
          adminUser {
            id
            name
            email
            phone
            profileImage
            createdAt
            updatedAt
          }
        }
        nextToken
      }
    }
  }
`;

export const getUnitProductLaneId = /* GraphQL */ `
  query GetUnitProduct($id: ID!) {
    getUnitProduct(id: $id) {
      laneId
    }
  }
`;
