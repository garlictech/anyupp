@product @edit
Feature: Edit the Chain product

    On the Chain products, we can edit a product with basic infos 
    such as the name, description, type or category. After the submitting, 
    the edited product should display on the product list. These examples 
    do not belong to the variants.

Background: Go to Chain Product Edit page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page
  And I am on the "chain products" list
  When I click on the first "edit" button

@layout 
Scenario: Check form dialog title
  When I click ont the first "edit" button
  Then the "Edit product" title is displayed

Scenario: Check hidden dialog
  When I click on the "submit" button
  Then the "chain products" list displayed
  And the "Edit product" title is hidden

Scenario: Just close the edit page
  When I close the edit page
  Then I should see the product on the list

Scenario: Rename a Chain product
  Given I am on the "Name (EN)" input 
  And it contains "soup of the day"
  When I fill out with "soup of the day UPDATED NAME"
  And I click on the "submit" button
  Then the first product name is "soup of the day UPDATED NAME"

Scenario: Rewrite product description
  Given I am on the "Description (EN)" input 
  And it contains "soup"
  When I fill out with "soup UPDATED DESC"
  And I click on the "submit" button
  Then the first product description is "soup UPDATED DESC"

Scenario: Set new product category
  Given I am on the "soups and salads" category
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

Scenario: Product visibility
  When I click on the "checkbox" next to "is visible"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

Scenario: Product allergens
  When I click on the "checkbox" next to "lactose"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

Scenario: Remove the image of the product
  When I click on the "minus" button
  Then the image should be removed
  And the "image removed successfully" message displayed
  And I click on the "submit" button
  And I should see no image on the first product

#???
Scenario: Add an image to the product
  When I click on the "plus" button
  And I pick a picture from my files 
  Then I click on the "submit" button
  And I should see the image on th first product
