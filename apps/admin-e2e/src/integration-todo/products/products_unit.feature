@product @unit @edit @variant
Feature: Edit Unit product

    Edit unit product

Background: Go to Unit Product Edit page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "unit products" list
  When I click on the first "edit" button

Scenario: Select the lane
  Given I am at the Lane title
  When I click on the dropdown menu
  And I select the "Pult" option
  And I click on the "submit" button
  Then the "update succesfull" title displayed
  And the product list displayed

Scenario: Rename the variant
  Given I am at the "<name>" input
  When I fill out with "<name>"
  And I click on the "submit" button
  Then the "update successful" title displayed
  And the product list displayed  

Scenario: Add variant availability
  Given I am the "Variants" title
  When I click on the "Add availability" button
  Then the new Product Availability displayed

Scenario Outline: Variant types
