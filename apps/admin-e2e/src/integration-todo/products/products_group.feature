@product @group @edit @variant
Feature: Edit Group product

    Set the basic infos, and create variants.

Background: Go to Group Edit Product page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "group products" list
  When I click on the first "edit" button

Scenario: Check form message
  When I click on the "submit" button
  Then I should see "update succesfull" message is displayed

Scenario: Set the tax%


Scenario: Product visibility
  When I click on the "checkbox" next to "is visible"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

Scenario: Add variant availability
  When I click on the "Add availability" button
  Then I should see the "Type" selector
  And I should see the "Price (HUF)" input

Scenario Outline: Set variant type
#? examples with always/weekly/seasonal type
