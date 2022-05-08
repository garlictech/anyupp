interface Deps {
  getCurrentAdBannersEnabledStatus: () => Promise<boolean>;
  setAdBannersEnabledStatus: (props: { enabled: boolean }) => Promise<unknown>;
}

export const unitBannersToggleUseCase = async (
  deps: Deps,
): Promise<boolean> => {
  const { getCurrentAdBannersEnabledStatus, setAdBannersEnabledStatus } = deps;

  try {
    const toggledStatus = !(await getCurrentAdBannersEnabledStatus());

    await setAdBannersEnabledStatus({
      enabled: toggledStatus,
    });

    return toggledStatus;
  } catch (e) {
    console.error('Error in unitBannersToggleUseCase', e);

    return Promise.reject(e);
  }
};
