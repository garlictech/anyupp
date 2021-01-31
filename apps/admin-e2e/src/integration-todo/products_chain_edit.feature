@product @edit
Feature: Edit the Chain product

    On the Chain products, we can edit a product with basic infos 
    such as the name, description, type or category. After the submitting, 
    the edited product should display on the product list. These examples 
    do not belong to the variants.

Background:
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "chain products" list
  And I am on the first product

@layout 
Scenario: Check form dialog title
  When I am on the first product
  Then the "Edit product" title is displayed

Scenario: Check hidden dialog
  When I am on the first product
  And I click on the "submit" button
  Then the "chain products" list displayed

Scenario: Just close the edit page
  When I close the edit page
  Then I should see the product on the list
  But I should not see any changes of the product

Scenario: Rename a Chain product
  Given I am on the "Name (EN)" input 
  And it contains "soup of the day"
  When I give it "soup of the day UPDATED NAME" name
  And I click on the "submit" button
  Then the first product name is "soup of the day UPDATED NAME"

Scenario: Rewrite product description
  Given I am on the "Description (EN)" input 
  And it contains "soup"
  When I give it "soup UPDATED DESC" description
  And I click on the "submit" button
  Then the first product description is "soup UPDATED DESC"

Scenario: Set new product category
  Given I am on the product category
  And it has the "soups and salads"
  When I set the "daily offer" category
  And I click on the "submit" button
  And on the product list I set the "daily offer" category
  Then I should see the first product
  But I should not see the first product on the "soups and salads" category

Scenario: Set the product type
  Given I am on the product type
  And it has the "food"
  When I set the "other" type
  And I click on the "submit" button
  Then the first product type is "other"

Scenario: Product visibility
  When I click on the checkbox next to "is visible"
  Then the first list item "is visible"

Scenario: Product allergens
  When I click on the checkbox at the "lactose"
  And I click on the "submit" button



Scenario: Remove the image of the product
  And I am at the "image" part
  When I click on the "minus" icon
  Then the image should be removed
  And the "image successfully removed" message displayed
  And I click on the "submit" button
  And the first list item has no image

Scenario: Add an image to the product
  Given I
