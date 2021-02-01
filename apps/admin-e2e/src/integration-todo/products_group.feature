@product @group @edit @variant
Feature: Edit Group product

    Fill out the basic infos, then edit a variant below it.

Background: Go to Group Product Edit page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "group products" list
  When I click ont the first "edit" button

Scenario: Check form message

Scenario: Group set the tax%

Scenario: Add variant availability
  When I click on the "Add availability" button
  Then I should see the "Type" selector
  And I should see the "Price (HUF)" input

Scenario: Add variant availability