import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { ButtonUIComponent } from './button-ui.component';
import { action } from '@storybook/addon-actions';

export default {
  title: 'ButtonUIComponent',
  component: ButtonUIComponent,
  decorators: [
    moduleMetadata({
      imports: [],
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
  loading: false,
  style: 'primary',
};
