Feature: Allergens info link

  Background: Admin creates a product without any allergens
    Given the admin adds "Water" product with no allergens
    And the admin set the price to "100 Ft"

  Scenario: Check allergens info link if product has or not
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "WATER" card under "Test product category #1 name" category
    Then there is the product details screen
    And I should see "1 x 100 Ft" text
    And I should NOT see any allergens info link
    When I tap the "Add To Cart" button
    Then there is the "Menu" screen
    When I tap the "MY CART (100 Ft)" button
    Then there is the "Cart" screen
    And I should see the added "WATER"
    And I should NOT see any allergens info link
    When I tap the minus button
    Then I should see "Your cart is empty Add some products to your cart." text
    When I tap the "close" button
    And I tap the "FANTA #2" card under "Test product category #1 name" category
    Then there is the product details screen
    And I should see "Allergens" info link
    When I tap on the "Allergens" text
    Then I should see allergen icons from 1-14
    And as I scroll down I should see the description
    When I tap the back arrow
    Then I should see "1 x 298 Ft" text
    When I tap the "Add To Cart" button
    Then there is the "Menu" screen
    When I tap the "PAY (100 Ft)" button
    Then there is the "Cart" screen
    And I should see the added "FANTA #2"
    And I should see "Allergens" info link
    When I tap on the "Allergens" text
    Then I should see allergen icons from 1-14
