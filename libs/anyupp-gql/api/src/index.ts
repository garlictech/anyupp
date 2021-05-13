import * as AnyuppApi from './lib/generated/anyupp-api';
export { AnyuppApi };

// TEMPORARLY !!!
import gql from 'graphql-tag';

export const RegenerateUnitData = gql`
  mutation RegenerateUnitData($input: RegenerateUnitDataInput!) {
    regenerateUnitData(input: $input)
  }
`;