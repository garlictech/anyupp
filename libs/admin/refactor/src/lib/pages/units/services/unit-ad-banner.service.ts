import { Injectable } from '@angular/core';
import {
  AbsUnitBannerService,
  bannerType,
  ImageAsset,
  Unit,
  unitBannerAddUseCase,
  unitBannerRemoveUseCase,
  unitBannersToggleUseCase,
} from '@bgap/domain';
import { UnitCollectionService } from '../../../store/units';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchGqlError } from '../../../store/app-core';
import { Store } from '@ngrx/store';
import { StorageService } from '../../../shared/data-access/storage';
import { ImageCompressorService } from '../../../shared/utils';
import { EImageType } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class UnitBannerService extends AbsUnitBannerService {
  constructor(
    private _store: Store,
    private _unitCollectionService: UnitCollectionService,
    private _storageService: StorageService,
    private _imageCompressorService: ImageCompressorService,
  ) {
    super();
  }

  addNewBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    const { unitId, bannerImage, type } = params;

    return unitBannerAddUseCase({
      bannerImage,
      compressImage: ({ image, maxWidthOrHeight }) =>
        this._imageCompressorService
          .compress(image, EImageType.JPEG, maxWidthOrHeight)
          .pipe(
            take(1),
            tap(() => {
              // eslint-disable-next-line no-restricted-syntax
              console.debug('compressed file ready');
            }),
          )
          .toPromise(),
      getCurrentBanners: () => this.getCurrentBanners(unitId, type),
      updateBannersOnUnit: ({ banners }) =>
        this.saveBannersOnUnit(unitId, banners, type),
      uploadToStorage: async ({ folderPath, file }) => {
        return {
          storagePath: await this._storageService.uploadFile(folderPath, file),
        };
      },
    });
  }

  getAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean> {
    const { unitId } = params;
    return this.getCurrentUnit$(unitId)
      .pipe(
        map(unit => {
          return !!unit.adBannersEnabled;
        }),
      )
      .toPromise();
  }

  getBannersForUnit({
    unitId,
    type,
  }: {
    unitId: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    return this.getCurrentBanners(unitId, type);
  }

  removeBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
    type: bannerType;
  }): Promise<ImageAsset[]> {
    const { unitId, bannerPath, type } = params;

    return unitBannerRemoveUseCase({
      storagePath: bannerPath,
      getCurrentBanners: () => this.getCurrentBanners(unitId, type),
      updateBannersOnUnit: ({ banners }) =>
        this.saveBannersOnUnit(unitId, banners, type),
      deleteFromStorage: ({ folderPath }) =>
        this._storageService.removeFile(folderPath),
    });
  }

  toggleAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean> {
    const { unitId } = params;

    return unitBannersToggleUseCase({
      getCurrentBannersEnabledStatus: () =>
        this.getAdBannersEnabledStatusForUnit({ unitId }),
      setBannersEnabledStatus: ({ enabled }) => {
        return this._unitCollectionService
          .update$({
            id: unitId,
            adBannersEnabled: enabled,
          })
          .pipe(catchGqlError(this._store))
          .toPromise();
      },
    });
  }

  private getCurrentUnit$(unitId: string): Observable<Unit> {
    return this._unitCollectionService.getByKey$(unitId).pipe(take(1));
  }

  private getCurrentBanners(
    unitId: string,
    type: bannerType,
  ): Promise<ImageAsset[]> {
    return this.getCurrentUnit$(unitId)
      .pipe(
        map(unit => {
          return unit[`${type}Banners`] || [];
        }),
      )
      .toPromise();
  }

  private saveBannersOnUnit(
    unitId: string,
    banners: ImageAsset[],
    type: bannerType,
  ): Promise<unknown> {
    return this._unitCollectionService
      .update$({
        id: unitId,
        [`${type}Banners`]: banners,
      })
      .pipe(catchGqlError(this._store))
      .toPromise();
  }
}
