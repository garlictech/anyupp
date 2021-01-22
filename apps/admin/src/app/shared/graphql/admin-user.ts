import { gql } from 'apollo-angular';

export const gqlCreateAdminUser = gql`
  mutation CreateAdminUser($data: CreateAdminUserInput!) {
    createAdminUser(newAdminData: $data)
  }
`;
