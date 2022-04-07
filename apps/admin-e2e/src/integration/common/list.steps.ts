import { When } from 'cypress-cucumber-preprocessor/steps';
import { scrollDownVirtualList } from '../../support';

When('I scroll down the list with {string} dataTestId', (value: string) => {
  scrollDownVirtualList(value);
});
