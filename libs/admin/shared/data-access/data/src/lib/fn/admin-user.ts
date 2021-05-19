// import { EAdminRole,  } from '@bgap/shared/types';
/*
export const chainAdminFilter = (
  // checkedAdminUser: 
  // loggedAdminRole: EAdminRole, // Role,
): boolean => {
  return true;


  const loggedAdminChainIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.chainId,
  );
  const currentAdminChainIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.chainId,
  );
  // Chain admin shows only the group/unit admins and the staffs of his chains
  return [
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
    EAdminRole.STAFF,
  ].includes(checkedAdminUser.roles?.role || EAdminRole.INACTIVE)
    ? fp.intersection(loggedAdminChainIds, currentAdminChainIds).length > 0
    : false;

};

export const groupAdminFilter = (
  checkedAdminUser: 
  loggedAdminRole: EAdminRole, // Role,
): boolean => {
  return true;


  const loggedAdminGroupIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.unitId || '',
  );
  const currentAdminGroupIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.groupId || '',
  );

  // Group admin shows only the group/unit admins and the staffs of his chains
  return [EAdminRole.UNIT_ADMIN, EAdminRole.STAFF].includes(
    checkedAdminUser.roles?.role || EAdminRole.INACTIVE,
  )
    ? fp.intersection(loggedAdminGroupIds, currentAdminGroupIds).length > 0
    : false;

};

export const unitAdminFilter = (
  checkedAdminUser: 
  loggedAdminRole: EAdminRole, // Role,
): boolean => {
  return true;


  const loggedAdminUnitIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.unitId || '',
  );
  const currentAdminUnitIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.unitId || '',
  );

  // Unit admin shows only the group/unit admins and the staffs of his chains
  return checkedAdminUser.role === EAdminRole.STAFF
    ? fp.intersection(loggedAdminUnitIds, currentAdminUnitIds).length > 0
    : false;

};
*/
