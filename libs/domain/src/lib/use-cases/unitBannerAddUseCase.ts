import { ImageAsset } from '../entities';

export const UNIT_AD_BANNER_STORAGE_FOLDER = 'banners';
export const UNIT_AD_BANNER_MAX_SIZE = 640;

interface Deps {
  bannerImage: File;
  compressImage: (params: {
    image: File;
    maxWidthOrHeight: number;
  }) => Promise<File>;
  uploadToStorage: (params: {
    folderPath: string;
    file: File;
  }) => Promise<{ storagePath: string }>;
  getCurrentBanners: () => Promise<ImageAsset[]>;
  updateBannersOnUnit: (params: { banners: ImageAsset[] }) => Promise<unknown>;
}

export const unitBannerAddUseCase = async (
  deps: Deps,
): Promise<ImageAsset[]> => {
  const {
    bannerImage,
    compressImage,
    uploadToStorage,
    getCurrentBanners,
    updateBannersOnUnit,
  } = deps;

  try {
    const compressedBanner = await compressImage({
      image: bannerImage,
      maxWidthOrHeight: UNIT_AD_BANNER_MAX_SIZE,
    });

    const { storagePath } = await uploadToStorage({
      folderPath: `${UNIT_AD_BANNER_STORAGE_FOLDER}`,
      file: compressedBanner,
    });

    const updatedBanners = [
      ...(await getCurrentBanners()),
      { imageUrl: storagePath },
    ];

    await updateBannersOnUnit({
      banners: updatedBanners,
    });

    return updatedBanners;
  } catch (e) {
    console.error('Error in unitBannerRemoveUseCase', e);

    return Promise.reject(e);
  }
};
