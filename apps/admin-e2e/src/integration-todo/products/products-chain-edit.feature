@product @chain @edit @create
Feature: Edit or create Chain product

    On the Chain products, we can add or create a new product.

Background: Steps to the Edit Product page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "chain products" list
  And I am on the "soups and salads" category
  When I click on the first "edit" button

@layout 
Scenario Outline: Check form page
  When I click on the "<button>" button
  Then the "<title>" title is displayed
  When I click on the "submit" button
  Then the "chain products" page is displayed
  And the "<title>" title is hidden

  Examples:
      | button | title      |
      | Edit   | Edit Chain |
      | Plus   | New Chain  |

Scenario: Check form message
  When I click on the "submit" button
  Then the "chain products" list is displayed
  And I should see "update successful" message
#? it displayes for 2 secs

Scenario: Just close the edit page
  When I close the edit page
  Then I should see the chain product list
  But I should NOT see any changes on the product
#idk is it necessary?

Scenario Outline: Fill out the name and description
  When I click on the "<text>" input
  And I fill out with "<input>"
  And I click on the "submit" button

  Examples:
      | text             | input           |
      | Name (EN)        | new product     |
      | Description (EN) | new description |

Scenario: Categorize the product
  When I click on the "daily offer" category
  And I click on the "submit" button
  And I set the "daily offer" category at the Products header
  Then I should see the first product
  But I should NOT see the first product on the "soups and salads" category

Scenario: Set the product type
  Given I am at the product type
  And it contains "food"
  When I click on the "other"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "other" type
  #data table: 3 types

Scenario Outline: Checkboxes for visibility and product allergens
  When I click on the "checkbox" next to "<text>"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

  Examples:
      | text       |
      | is visible |
      | lactose    |
      | nuts       |

Scenario: Remove the image of the product
  When I click on the "minus" button
  Then the image should be removed
  And the "image removed successfully" message displayed
  And I click on the "submit" button
  And I should NOT see the image on the first product

Scenario: Add an image to the product
  When I click on the "plus" button
  And I select a picture from my files 
  Then I click on the "submit" button
  And I should see the image on the first product
#??? weird stuff