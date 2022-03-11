Feature: Allergens info link

  Background: Admin creates a product without any allergens
    Given the admin adds "Water" product with no allergens
    And the admin set the price to "100 Ft"
    And the admin updates the menu with the "REGENERATE MENU" button

  Scenario: Check allergens info link if product has or not
    #in Késdobáló #111 unit
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen
    When I tap the "WATER" card under "Hamburgers" category
    Then there is the product details screen
    And I should see "1 x 100 Ft" text
    And I should NOT see any allergens info link
    When I tap the "Add To Cart" button
    Then there is the "Menu" screen
    When I tap the "MY CART (100 Ft)" button
    Then there is the "Cart" screen
    And I should see the added "WATER"
    When I tap the minus button
    Then I should see "Your cart is empty Add some products to your cart." text
    When I tap the "close" button
    And I tap the "Sajtburger" card under "Hamburgers" category
    Then I should see "Allergens" info text
    Then I should see "Sesame (12)" text
