Feature: Add more items to cart

  Background: Login to the App and select the Kesdobalo#111
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen
    When I tap on the "You can switch between ordering methods at any time." text
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Different items in the cart
    When I tap on the "Sajtburger" card under "Hamburgers" category
    And I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    And I should see "MY CART (1700 Ft)" button
    When I tap on the "Non-alcoholic drinks" category
    And I tap on the "Coca-cola" card
    Then I should see "Coca-cola klasszikus íz" text
    And I should see "1 x 300 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (2000 Ft)" button
    Then I should see the "CART" screen
    And I should see "Sajtburger" text
    And I should see "Coca-cola" text
    And I should see "PAY (2000 Ft)" button
    When I tap on the back arrow
    Then I should see the "Menu" screen
    When I tap on the "Beers" category
    And I tap on the "Dreher" card
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (2400 Ft)" button
    Then I should see the "CART" screen
    And I should see "Sajtburger" text
    And I should see "Coca-cola" text
    And I should see "Dreher" text
    And I should see "PAY (2400 Ft)" button

  Scenario: Deleting items from cart
    When I tap on the "Sajtburger" card under "Hamburgers" category
    And I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "Non-alcoholic drinks" category
    And I tap on the "Coca-cola" card
    And I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (2000 Ft)" button
    Then I should see the "CART" screen
    And I should see "Sajtburger" text
    And I should see "Coca-cola" text
    When I tap on the plus button next to "1 x 1700 Ft" text
    Then I should see "2 x 1700 Ft" text
    And I should see "PAY (3700 Ft)" button
    When I tap on the plus button next to "1 x 300 Ft" text
    Then I should see "2 x 300 Ft" text
    And I should see "PAY (4000 Ft)" button
    When I tap on the "Delete cart" button
    Then I should see "Are you sure you want to delete your cart?" dialog
    When I tap on the "Delete" button
    Then I should see the "Menu" screen
    And I should NOT see "MY CART"
