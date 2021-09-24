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
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator
    When I tap the "WATER" card under "Test product category #1 name" category
    Then there is the product details screen
    And I should NOT see any allergens info link
    When I tap the "Add To Cart (100Ft)" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    And I should see the added "WATER"
    And I should NOT see any allergens info link
    When I tap the minus button
    Then I should see "Your cart is empty Add some products to your cart." text
    When I tap the "Menu" icon
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    Then there is the product details screen
    And I should see "Allergens" info link
    When I tap on the "Allergens" text
    Then I should see allergen icons from 1-14
    And as I scroll down I should see the description
    When I tap the back arrow
    And I tap the "Add To Cart (298Ft)" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    And I should see the added "FANTA #2"
    And I should see "Allergens" info link
    When I tap on the "Allergens" text
    Then I should see allergen icons from 1-14
