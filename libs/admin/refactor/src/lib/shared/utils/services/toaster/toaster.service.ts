import { Injectable } from '@angular/core';
import { NbToastrConfig, NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { EToasterType } from '../../enums';

@Injectable({
  providedIn: 'root',
})
export class ToasterService {
  constructor(
    private _nbToastrService: NbToastrService,
    private _translateService: TranslateService,
  ) {}

  public show(
    type: EToasterType,
    message: string,
    title?: string,
    config?: Partial<NbToastrConfig>,
  ) {
    this._nbToastrService[type](
      message ? this._translateService.instant(message) : '',
      title ? this._translateService.instant(title) : '',
      config,
    );
  }

  public showSimpleSuccess(type: string) {
    this.show(EToasterType.SUCCESS, '', `common.${type}Success`);
  }

  public showSimpleDanger(title: string) {
    this.show(EToasterType.DANGER, '', title);
  }
}
