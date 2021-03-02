import { EAdminRole, IAdminUser, IAdminUserRole } from 'libs/shared/types/src';
import { intersection as _intersection } from 'lodash-es';

export const chainAdminFilter = (checkedAdminUser: IAdminUser, loggedAdminRole: IAdminUserRole): boolean => {
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
    ? _intersection(loggedAdminChainIds, currentAdminChainIds).length > 0
    : false;
};

export const groupAdminFilter = (checkedAdminUser: IAdminUser, loggedAdminRole: IAdminUserRole): boolean => {
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
    ? _intersection(loggedAdminGroupIds, currentAdminGroupIds).length > 0
    : false;
};

export const unitAdminFilter = (checkedAdminUser: IAdminUser, loggedAdminRole: IAdminUserRole): boolean => {
  const loggedAdminUnitIds = (loggedAdminRole?.entities ?? []).map(
    (e): string => e.unitId || '',
  );
  const currentAdminUnitIds = (checkedAdminUser?.roles?.entities ?? []).map(
    (e): string => e.unitId || '',
  );

  // Unit admin shows only the group/unit admins and the staffs of his chains
  return checkedAdminUser.roles?.role === EAdminRole.STAFF
    ? _intersection(loggedAdminUnitIds, currentAdminUnitIds).length > 0
    : false;
};
