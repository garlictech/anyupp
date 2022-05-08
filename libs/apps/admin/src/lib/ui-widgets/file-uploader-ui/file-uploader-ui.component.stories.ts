import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { FileUploaderUIComponent } from './file-uploader-ui.component';
import { ButtonUIComponent } from '../button-ui/button-ui.component';

export default {
  title: 'FileUploaderUIComponent',
  component: FileUploaderUIComponent,
  decorators: [
    moduleMetadata({
      declarations: [ButtonUIComponent],
      imports: [],
    }),
  ],
} as Meta<FileUploaderUIComponent>;

const Template: Story<FileUploaderUIComponent> = (
  args: FileUploaderUIComponent,
) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  disabled: false,
};
