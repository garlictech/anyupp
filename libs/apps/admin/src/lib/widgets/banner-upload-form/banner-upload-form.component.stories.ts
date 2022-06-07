import { ReactiveFormsModule } from '@angular/forms';
import {
  AbsImageCompressorService,
  AbsStorageService,
  AbsUnitBannerService,
  AbsUnitRepository,
  mockUnit,
} from '@bgap/domain';
import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { commonStorybookImports } from '../../pure';
import {
  MockImageCompressionService,
  MockStorageService,
  MockUnitBannerService,
  MockUnitRepositoryService,
} from '../../services';
import { ButtonUIComponent } from '../../ui-widgets/button-ui/button-ui.component';
import { FileUploaderUIComponent } from '../../ui-widgets/file-uploader-ui/file-uploader-ui.component';
import { ToggleButtonUiComponent } from '../../ui-widgets/toggle-button-ui/toggle-button-ui.component';
import { UnitBannerUIComponent } from '../../ui-widgets/unit-banner-ui/unit-banner-ui.component';
import { BannerUploadFormComponent } from './banner-upload-form.component';

export default {
  title: 'BannerUploadFormComponent',
  component: BannerUploadFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        FileUploaderUIComponent,
        UnitBannerUIComponent,
        ButtonUIComponent,
        ToggleButtonUiComponent,
      ],
      imports: [ReactiveFormsModule, ...commonStorybookImports],
      providers: [
        { provide: AbsUnitBannerService, useClass: MockUnitBannerService },
        { provide: AbsStorageService, useClass: MockStorageService },
        {
          provide: AbsImageCompressorService,
          useClass: MockImageCompressionService,
        },
        { provide: AbsUnitRepository, useClass: MockUnitRepositoryService },
      ],
    }),
  ],
} as Meta<BannerUploadFormComponent>;

const Template: Story<BannerUploadFormComponent> = (
  args: BannerUploadFormComponent,
) => ({
  props: {
    ...args,
    onOperationSuccess: action('onOperationSuccess'),
    onOperationError: action('onOperationError'),
  },
  template:
    '<lib-admin-banner-upload-form ' +
    '[unitId]="unitId" ' +
    '[type]="type" ' +
    '[imageUrlPrefix]="imageUrlPrefix" ' +
    '(operationSuccess)="onOperationSuccess($event)" ' +
    '(operationError)="onOperationError($event)"></lib-admin-banner-upload-form>',
});

export const Primary = Template.bind({});
Primary.args = {
  unitId: mockUnit.id,
  imageUrlPrefix: 'https://placekitten.com/',
  type: 'ad',
};
