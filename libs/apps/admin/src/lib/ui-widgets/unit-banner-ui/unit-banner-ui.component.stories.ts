import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { commonStorybookImports } from '../../pure';
import { ButtonUIComponent } from '../button-ui/button-ui.component';
import { UnitBannerUIComponent } from './unit-banner-ui.component';

export default {
  title: 'UnitBannerUIComponent',
  component: UnitBannerUIComponent,
  decorators: [
    moduleMetadata({
      declarations: [ButtonUIComponent],
      imports: [...commonStorybookImports],
    }),
  ],
} as Meta<UnitBannerUIComponent>;

const Template: Story<UnitBannerUIComponent> = (
  args: UnitBannerUIComponent,
) => ({
  props: {
    ...args,
    onDeleteRequested: action('onDeleteRequested'),
  },
  template:
    '<lib-admin-unit-banner-ui (deleteRequested)="onDeleteRequested($event)"></lib-admin-unit-banner-ui>',
});

export const Primary = Template.bind({});
Primary.args = {
  bannerPath: '160/90',
  bannerUrlPrefix: 'https://placekitten.com/',
  disabled: true,
};
