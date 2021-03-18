@product @unit @edit @variant
Feature: Edit Unit product

    Edit unit product

Background: Go to Unit Product Edit page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the unit products list
  When I click on the first "edit" button

@layout 
Scenario: Check form dialog text
  When I click on the first "edit" button
  Then the "Edit product" text is displayed

Scenario: Check hidden dialog
  When I click on the "submit" button
  Then the "unit products" list is displayed
  And the "Edit product" text is hidden

Scenario: Check form message
  When I click on the "submit" button
  Then I should see "update succesfull" message is displayed

Scenario: Select the lane
  Given I am at the Lane title
  When I click on the dropdown menu
  And I select the "Pult" option
  And I click on the "submit" button
  Then the product list displayed

Scenario: Product visibility
  When I click on the "checkbox" next to "is visible"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

Scenario: Rename the variant
  Given I am at the "Variant name (EN)" input
  When I fill out with "variant updated"
  And I click on the "submit" button
  Then the product list displayed
  And the "variant updated" is displayed below the first product
#also, pack size and unit

Scenario: Resize and reunit
  And I click on the "Pack size" input
  And I fill out with "1"
  And I click on the "Pack unit" input
  And I fill out with "liter"
  And I click on the "submit" button
  Then I should see the "new product" on the list
  And I should see the "new variant"

Scenario: Add variant availability
  When I click on the "Add availability" button
  Then I should see the "Type" selector
  And I should see the "Price (HUF)" input

Scenario Outline: Variant types
