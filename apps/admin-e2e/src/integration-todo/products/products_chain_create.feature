@create @chain @product @variant
Feature: Create a Chain product

    Create a new product with name and description. Also 
    set the category and type. If you do NOT set the type, 
    then you can not submit it. Lately, you can add variants
    for the new product.

Background: Steps to the New product page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am at the "chain products" list
  When I click on the "plus" button

Scenario: Check form dialog text
  When I click on the "plus" button
  Then the "new product" text is displayed
  #background's last step displays here

Scenario: Check form message
  When I click on the "submit" button
  Then I should see "insert successful" message
  #this message always displays when you add a new product (with the submit button)

Scenario: Give a name for the new product
  When I click on the "Name (EN)" input
  And I fill out with "new product"
  And I click on the "submit" button

Scenario: Write a description for the new product
  When I click on the "Description (EN)" input
  And I give a name "new description"
  And I click on the "submit" button

Scenario: Give a category for the new product
#? it already has the category, it depends on what category is 
# choosed before we create the product

Scenario: Set the type of the new product
  Given I am at the "product type" dropdown menu
  When I click on the "other"
  And I click on the "submit" button
  Then I should see the "chain products" list
  When I click on the same product
  Then I should see the "other" type

Scenario: Create a new variant for the new product
  When I click on the "Variant name (EN)" input
  And I fill out "new variant"
  And I click on the "Pack size" input
  And I fill out with "1"
  And I click on the "Pack unit" input
  And I fill out with "liter"
  And I click on the "submit" button
  Then I should see the "new product" on the list
  And I should see the "new variant"
#variant displays below the product name, in a "box"

Scenario: Add an image to the new product
#how? for this scenario, we need files?