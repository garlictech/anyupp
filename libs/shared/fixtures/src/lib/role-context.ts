import * as CrudApi from '@bgap/crud-gql/api';

import { chainFixture } from './chain';
import { groupFixture } from './group';
import { unitFixture } from './unit';
import { testIdPrefix } from './common';

const roleContextId_01 = `${testIdPrefix}role_context_1_id`;

const roleContextBase = {
  groupId: groupFixture.group_01.id,
  chainId: chainFixture.chain_01.id,
  unitId: unitFixture.unit_01.id,
  contextId: 'CTX_FIXTURE',
  name: {
    hu: 'Context Fixture',
    en: 'Context Fixture',
    de: 'Context Fixture',
  },
  role: CrudApi.Role.superuser,
};

const roleContextInputBase: CrudApi.CreateRoleContextInput = {
  ...roleContextBase,
  id: roleContextId_01,
};

export const roleContextFixture = {
  roleContextBase,
  roleContextInputBase,
};
