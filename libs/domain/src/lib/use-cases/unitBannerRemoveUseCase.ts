import { ImageAsset } from '../entities';

interface Deps {
  storagePath: string;
  getCurrentBanners: () => Promise<ImageAsset[]>;
  updateBannersOnUnit: (params: { banners: ImageAsset[] }) => Promise<unknown>;
  deleteFromStorage: (params: { folderPath: string }) => Promise<unknown>;
}

export const unitBannerRemoveUseCase = async (
  deps: Deps,
): Promise<ImageAsset[]> => {
  const {
    storagePath,
    getCurrentBanners,
    updateBannersOnUnit,
    deleteFromStorage,
  } = deps;

  try {
    const updatedBanners: ImageAsset[] = (await getCurrentBanners()).filter(
      adBanner => adBanner.imageUrl !== storagePath,
    );

    await updateBannersOnUnit({
      banners: updatedBanners,
    });

    await deleteFromStorage({
      folderPath: storagePath,
    });

    return updatedBanners;
  } catch (e) {
    console.error('Error in unitBannerRemoveUseCase', e);

    return Promise.reject(e);
  }
};
