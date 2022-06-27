/* eslint-disable @typescript-eslint/no-explicit-any */
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { commonStorybookImports } from '../../pure';
import { DragNDropNestedListComponent } from './drag-n-drop-nested-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { action } from '@storybook/addon-actions';

@Component({
  selector: 'bgap-test-nested-list-item',
  template: 'Demo list item component with data: <div>{{ data | json }}</div>',
})
class DragNDropNestedListItemComponent {
  @Input() data?: any;
}

export default {
  title: 'DragNDropNestedListComponent',
  component: DragNDropNestedListComponent,
  decorators: [
    moduleMetadata({
      declarations: [DragNDropNestedListItemComponent],
      imports: [...commonStorybookImports, DragDropModule],
      providers: [],
    }),
  ],
} as Meta<DragNDropNestedListComponent>;

const Template: Story<DragNDropNestedListComponent> = (
  args: DragNDropNestedListComponent,
) => ({
  props: {
    ...args,
    onNodeChange: action('onNodeChange'),
  },
  template:
    '<lib-admin-drag-n-drop-nested-list ' +
    '[dataSource]="dataSource"' +
    '[nestConfig]="nestConfig"' +
    '[listItemTemplate]="listItemTemplate"' +
    '(nodeChange)="onNodeChange($event)">' +
    '</lib-admin-drag-n-drop-nested-list>' +
    '<ng-template #listItemTemplate let-data="data">' +
    '<bgap-test-nested-list-item [data]="data"></bgap-test-nested-list-item>' +
    '</ng-template>',
});

export const Primary = Template.bind({});
Primary.args = {
  dataSource: [
    {
      id: '1',
      name: 'John',
    },
    {
      id: '2',
      name: 'Sam',
    },
    {
      id: '3',
      name: 'Jimmy',
    },
    {
      id: '4',
      name: 'Amanda',
    },
    {
      id: '5',
      name: 'Steve',
    },
    {
      id: '6',
      name: 'Carl',
    },
    {
      id: '7',
      name: 'Carl',
    },
    {
      id: '8',
      name: 'Abigel',
    },
  ],
  nestConfig: [
    {
      id: '3',
    },
    {
      id: '1',
      parentId: '3',
    },
    {
      id: '2',
    },
    {
      id: '4',
      parentId: '1',
    },
    {
      id: '5',
      parentId: '2',
    },
    {
      id: '6',
      parentId: '4',
    },
    {
      id: '7',
      parentId: '4',
    },
    {
      id: '8',
      parentId: '1',
    },
  ],
};
