import { Injectable } from '@angular/core';
import {
  AbsUnitAdBannerService,
  AdBanner,
  CrudApi,
  unitBannerAddUseCase,
  unitBannerRemoveUseCase,
  unitBannersToggleUseCase,
} from '@bgap/domain';
import { UnitCollectionService } from '@bgap/admin/store/units';
import { map, take, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { Store } from '@ngrx/store';
import { StorageService } from '@bgap/admin/shared/data-access/storage';
import { ImageCompressorService } from '@bgap/admin/shared/utils';
import { EImageType } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class UnitAdBannerService extends AbsUnitAdBannerService {
  constructor(
    private _store: Store,
    private _unitCollectionService: UnitCollectionService,
    private _storageService: StorageService,
    private _imageCompressorService: ImageCompressorService,
  ) {
    super();
  }

  addNewAdBannerToUnit(params: {
    bannerImage: File;
    unitId: string;
  }): Promise<AdBanner[]> {
    const { unitId, bannerImage } = params;

    return unitBannerAddUseCase({
      bannerImage,
      compressImage: ({ image, maxWidthOrHeight }) =>
        this._imageCompressorService
          .compress(image, EImageType.JPEG, maxWidthOrHeight)
          .pipe(
            take(1),
            tap(() => console.debug('compressed file ready')),
          )
          .toPromise(),
      getCurrentAdBanners: () => this.getCurrentAdBanners(unitId),
      updateAdBannersOnUnit: ({ adBanners }) =>
        this.saveAdBannersOnUnit(unitId, adBanners),
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
          return unit.adBannersEnabled || false;
        }),
      )
      .toPromise();
  }

  getAdBannersForUnit({ unitId }: { unitId: string }): Promise<AdBanner[]> {
    return this.getCurrentAdBanners(unitId);
  }

  removeAdBannerFromUnit(params: {
    unitId: string;
    bannerPath: string;
  }): Promise<AdBanner[]> {
    const { unitId, bannerPath } = params;

    return unitBannerRemoveUseCase({
      storagePath: bannerPath,
      getCurrentAdBanners: () => this.getCurrentAdBanners(unitId),
      updateAdBannersOnUnit: ({ adBanners }) =>
        this.saveAdBannersOnUnit(unitId, adBanners),
      deleteFromStorage: ({ folderPath }) =>
        this._storageService.removeFile(folderPath),
    });
  }

  toggleAdBannersEnabledStatusForUnit(params: {
    unitId: string;
  }): Promise<boolean> {
    const { unitId } = params;

    return unitBannersToggleUseCase({
      getCurrentAdBannersEnabledStatus: () =>
        this.getAdBannersEnabledStatusForUnit({ unitId }),
      setAdBannersEnabledStatus: ({ enabled }) => {
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

  private getCurrentUnit$(unitId: string): Observable<CrudApi.Unit> {
    return this._unitCollectionService.getByKey$(unitId).pipe(take(1));
  }

  private getCurrentAdBanners(unitId: string): Promise<AdBanner[]> {
    return this.getCurrentUnit$(unitId)
      .pipe(
        map(unit => {
          return unit.adBanners || [];
        }),
      )
      .toPromise();
  }

  private async saveAdBannersOnUnit(
    unitId: string,
    adBanners: AdBanner[],
  ): Promise<unknown> {
    return this._unitCollectionService
      .update$({
        id: unitId,
        adBanners,
      })
      .pipe(catchGqlError(this._store))
      .toPromise();
  }
}
