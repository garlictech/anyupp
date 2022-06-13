interface Deps {
  getCurrentBannersEnabledStatus: () => Promise<boolean>;
  setBannersEnabledStatus: (props: { enabled: boolean }) => Promise<unknown>;
}

export const unitBannersToggleUseCase = async (
  deps: Deps,
): Promise<boolean> => {
  const { getCurrentBannersEnabledStatus, setBannersEnabledStatus } = deps;

  try {
    const toggledStatus = !(await getCurrentBannersEnabledStatus());

    await setBannersEnabledStatus({
      enabled: toggledStatus,
    });

    return toggledStatus;
  } catch (e) {
    console.error('Error in unitBannersToggleUseCase', e);

    return Promise.reject(e);
  }
};
