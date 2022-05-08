import { AdBanner } from '@bgap/domain';

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
  getCurrentAdBanners: () => Promise<AdBanner[]>;
  updateAdBannersOnUnit: (params: {
    adBanners: AdBanner[];
  }) => Promise<unknown>;
}

export const unitBannerAddUseCase = async (deps: Deps): Promise<AdBanner[]> => {
  const {
    bannerImage,
    compressImage,
    uploadToStorage,
    getCurrentAdBanners,
    updateAdBannersOnUnit,
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

    const updatedAdBanners = [
      ...(await getCurrentAdBanners()),
      { imageUrl: storagePath },
    ];

    await updateAdBannersOnUnit({
      adBanners: updatedAdBanners,
    });

    return updatedAdBanners;
  } catch (e) {
    console.error('Error in unitBannerRemoveUseCase', e);

    return Promise.reject(e);
  }
};
