import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { commonStorybookImports } from '../../pure';
import { ButtonUIComponent } from './button-ui.component';

export default {
  title: 'ButtonUIComponent',
  component: ButtonUIComponent,
  decorators: [
    moduleMetadata({
      imports: [...commonStorybookImports],
    }),
  ],
} as Meta<ButtonUIComponent>;

const Template: Story<ButtonUIComponent> = (args: ButtonUIComponent) => ({
  props: {
    ...args,
    onButtonPush: action('onButtonPush'),
  },
  template:
    '<lib-admin-button-ui (pushed)="onButtonPush($event)"></lib-admin-button-ui>',
});

export const Primary = Template.bind({});
Primary.args = {
  label: 'Test Button',
  disabled: false,
  rounded: false,
  loading: false,
  size: 'sm',
  color: 'primary',
};
