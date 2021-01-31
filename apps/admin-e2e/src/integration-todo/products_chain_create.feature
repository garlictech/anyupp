@chain @product @create @variant
Feature: Create a Chain product

    The new product with a name and description. Pick the category and type, 
    create some variants for it. Pick allergens, if it has. And lately, 
    upload an image for the new product.

Background:
  Given I am logged in with my existing profile
  And I am at the "english" language
  And I am at the "Products" page
  And I am at the "Chain products" tab

Scenario: Start to create the new product
  When I click on the "plus" button
  Then the "new product" page displayed

Scenario: Give a name for the new product
  When I click on the "Name (EN)" input
  And I fill out with "new product"
  And I click on the submit button

Scenario: Write a description for the new product


Scenario: Give a category for the new product


Scenario: Set the type of the new product


Scenario: Create a new variant for the new product


Scenario: Upload an image for the new product