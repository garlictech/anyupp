@create @chain @product @variant
Feature: Create a Chain product

    We only need 3 steps to add a new product. Give a name, a description and
    pick the type of the product. Without these steps, you cannot add the new product.

Background: Steps to the New product page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am at the "chain products" list
  And I am on the "daily offer" category
  When I click on the "plus" button

Scenario: Check form dialog text
  When I click on the "plus" button
  Then the "New product" text is displayed

Scenario: Check hidden dialog
  When I click on the "submit" button
  Then the "chain products" list is displayed
  And the "New product" title is hidden

Scenario: Check form message
  When I click on the "submit" button
  Then the "chain products" list is displayed
  And I should see "insert successful" message

Scenario Outline: Fill out the name and description
  When I click on the "<text>" input
  And I fill out with "<input>"
  And I click on the "submit" button

  Examples:
      | text             | input           |
      | Name (EN)        | new product     |
      | Description (EN) | new description |

Scenario: Set the type of the new product
  Given I am at the "product type" dropdown menu
  When I click on the "other"
  And I click on the "submit" button
  Then I should see the "chain products" list
  When I click on the same product
  Then I should see the "other" type

Scenario: Add an image to the new product
#how? for this scenario, we need files?