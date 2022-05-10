import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { BannerUploadFormComponent } from './banner-upload-form.component';
import { FileUploaderUIComponent } from '../../ui-widgets/file-uploader-ui/file-uploader-ui.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AbsImageCompressorService,
  AbsStorageService,
  AbsUnitAdBannerService,
  AbsUnitRepository,
  mockUnit,
} from '@bgap/domain';
import { UnitBannerUIComponent } from '../../ui-widgets/unit-banner-ui/unit-banner-ui.component';
import { ButtonUIComponent } from '../../ui-widgets/button-ui/button-ui.component';
import {
  MockImageCompressionService,
  MockStorageService,
  MockUnitAdBannerService,
  MockUnitRepositoryService,
} from '../../services';
import { action } from '@storybook/addon-actions';

export default {
  title: 'BannerUploadFormComponent',
  component: BannerUploadFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [
        FileUploaderUIComponent,
        UnitBannerUIComponent,
        ButtonUIComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: AbsUnitAdBannerService, useClass: MockUnitAdBannerService },
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
    '[imageUrlPrefix]="imageUrlPrefix" ' +
    '(operationSuccess)="onOperationSuccess($event)" ' +
    '(operationError)="onOperationError($event)"></lib-admin-banner-upload-form>',
});

export const Primary = Template.bind({});
Primary.args = {
  unitId: mockUnit.id,
  imageUrlPrefix: 'https://placekitten.com/',
};
