import { Injectable } from '@angular/core';
import { NbToastrConfig, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

export enum EToasterType {
  DANGER = 'danger',
  DEFAULT = 'default',
  INFO = 'info',
  PRIMARY = 'primary',
  SHOW = 'show',
  SUCCESS = 'success',
  WARNING = 'warning',
}

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(private _nbToastrService: NbToastrService, private _translateService: TranslateService) {}

  public show(type: EToasterType, message: any, title?: any, config?: Partial<NbToastrConfig>): void {
    this._nbToastrService[type](
      message ? this._translateService.instant(message) : '',
      title ? this._translateService.instant(title) : '',
      config
    );
  }
}
