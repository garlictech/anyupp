import { AdBanner } from '@bgap/domain';

interface Deps {
  storagePath: string;
  getCurrentAdBanners: () => Promise<AdBanner[]>;
  updateAdBannersOnUnit: (params: {
    adBanners: AdBanner[];
  }) => Promise<unknown>;
  deleteFromStorage: (params: { folderPath: string }) => Promise<unknown>;
}

export const unitBannerRemoveUseCase = async (
  deps: Deps,
): Promise<AdBanner[]> => {
  const {
    storagePath,
    getCurrentAdBanners,
    updateAdBannersOnUnit,
    deleteFromStorage,
  } = deps;

  try {
    const updatedAdBanners: AdBanner[] = (await getCurrentAdBanners()).filter(
      adBanner => adBanner.imageUrl !== storagePath,
    );

    await updateAdBannersOnUnit({
      adBanners: updatedAdBanners,
    });

    await deleteFromStorage({
      folderPath: storagePath,
    });

    return updatedAdBanners;
  } catch (e) {
    console.error('Error in unitBannerRemoveUseCase', e);

    return Promise.reject(e);
  }
};
