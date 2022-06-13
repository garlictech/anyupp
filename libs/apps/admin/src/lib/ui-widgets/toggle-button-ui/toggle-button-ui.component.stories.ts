import { action } from '@storybook/addon-actions';
import { Meta, moduleMetadata, Story } from '@storybook/angular';

import { commonStorybookImports } from '../../pure';
import { ButtonUIComponent } from '../button-ui/button-ui.component';
import { ToggleButtonUiComponent } from './toggle-button-ui.component';

export default {
  title: 'ToggleButtonUiComponent',
  component: ToggleButtonUiComponent,
  decorators: [
    moduleMetadata({
      declarations: [ButtonUIComponent],
      imports: [...commonStorybookImports],
    }),
  ],
} as Meta<ToggleButtonUiComponent>;

const Template: Story<ToggleButtonUiComponent> = (
  args: ToggleButtonUiComponent,
) => ({
  props: {
    ...args,
    onButtonToggle: action('onButtonToggle'),
  },
  template:
    '<lib-admin-toggle-button-ui (toggledEvent)="onButtonToggle($event)"></lib-admin-toggle-button-ui>',
});

export const Primary = Template.bind({});
Primary.args = {
  disabled: true,
  toggled: true,
  rounded: true,
  size: 'sm',
  options: {
    toggledText: '🔊',
    untoggledText: '🔇',
  },
};
