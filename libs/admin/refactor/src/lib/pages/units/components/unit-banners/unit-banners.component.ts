import { Component, Injector } from '@angular/core';
import { awsConfig } from '@bgap/crud-gql/api';
import { AbsUnitBannerService, Unit } from '@bgap/domain';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { UnitBannerService } from '../../services/unit-ad-banner.service';

@Component({
  selector: 'bgap-unit-banners',
  templateUrl: './unit-banners.component.html',
  styleUrls: ['./unit-banners.component.scss'],
  providers: [
    {
      provide: AbsUnitBannerService,
      useClass: UnitBannerService,
    },
  ],
})
export class UnitBannersComponent extends AbstractFormDialogComponent {
  constructor(protected override _injector: Injector) {
    super(_injector);
  }

  unit!: Unit;

  get awsStoragePathPrefix(): string {
    return `https://${awsConfig.aws_user_files_s3_bucket}.s3-${awsConfig.aws_user_files_s3_bucket_region}.amazonaws.com/public/`;
  }
}
