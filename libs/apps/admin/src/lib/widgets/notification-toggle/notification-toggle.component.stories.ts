import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { AbsNotificationToggleService } from '@bgap/domain';
import { MockNotificationToggleService } from '../../services';
import { ButtonUIComponent } from '../../ui-widgets/button-ui/button-ui.component';
import { ToggleButtonUiComponent } from '../../ui-widgets/toggle-button-ui/toggle-button-ui.component';

import { NotificationToggleComponent } from './notification-toggle.component';

export default {
  title: 'NotificationToggleComponent',
  component: NotificationToggleComponent,
  decorators: [
    moduleMetadata({
      declarations: [ToggleButtonUiComponent, ButtonUIComponent],
      imports: [],
      providers: [
        {
          provide: AbsNotificationToggleService,
          useClass: MockNotificationToggleService,
        },
      ],
    }),
  ],
} as Meta<NotificationToggleComponent>;

const Template: Story<NotificationToggleComponent> = (
  args: NotificationToggleComponent,
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  size: 'sm',
};
