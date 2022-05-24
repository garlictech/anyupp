// import {   } from '@bgap/shared/types';
/*
export const chainadminFilter = (
  // checkedAdminUser: 
  // loggedAdminRole: CrudApi.Role, // Role,
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
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
    CrudApi.Role.staff,
  ].includes(checkedAdminUser.roles?.role || CrudApi.Role.inactive)
    ? fp.intersection(loggedAdminChainIds, currentAdminChainIds).length > 0
    : false;

};

export const groupadminFilter = (
  checkedAdminUser: 
  loggedAdminRole: CrudApi.Role, // Role,
): boolean => {
  return true;


  const loggedAdminGroupIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.unitId || '',
  );
  const currentAdminGroupIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.groupId || '',
  );

  // Group admin shows only the group/unit admins and the staffs of his chains
  return [CrudApi.Role.unitadmin, CrudApi.Role.staff].includes(
    checkedAdminUser.roles?.role || CrudApi.Role.inactive,
  )
    ? fp.intersection(loggedAdminGroupIds, currentAdminGroupIds).length > 0
    : false;

};

export const unitAdminFilter = (
  checkedAdminUser: 
  loggedAdminRole: CrudApi.Role, // Role,
): boolean => {
  return true;


  const loggedAdminUnitIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.unitId || '',
  );
  const currentAdminUnitIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.unitId || '',
  );

  // Unit admin shows only the group/unit admins and the staffs of his chains
  return checkedAdminUser.role === CrudApi.Role.staff
    ? fp.intersection(loggedAdminUnitIds, currentAdminUnitIds).length > 0
    : false;

};
*/
