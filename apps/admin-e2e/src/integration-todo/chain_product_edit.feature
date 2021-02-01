@product @edit
Feature: Edit page displays on the Chain product

Scenario: Go to the Chain Edit page
  Given I am logged in as an admin
  And I am at the "english" language
  And I am at the "Products" page
  And I am at the "Chain products" tab
  When I click ont the first "Edit" button of the list
  Then the "Edit product" title is displayed
