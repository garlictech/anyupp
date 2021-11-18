Feature: Update menu and see the changes in the app

  Scenario: Admin set the product to inactive
    Given the admin set the "FANTA #2" product to INACTIVE
    And the admin pushes the "Regenerate menu" button
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should NOT see "FANTA #2" with picture
    When the admin set the "FANTA #2" product to ACTIVE
    And the app user closes the App
    And the app user opens the App
    Then there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the on "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture

  Scenario: Admin set all the products to inactive
    Given the admin set the "HAMBURGER #1" product to INACTIVE
    Given the admin set the "FANTA #2" product to INACTIVE
    And the admin pushes the "Regenerate menu" button
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "..." text
    When the admin set the "HAMBURGER #1" product to ACTIVE
    When the admin set the "FANTA #2" product to ACTIVE
    And the anyupp user closes the App
    And the anyupp user opens the App
    Then there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the on "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture

  Scenario: Admin adds a new product
    Given the admin adds "Cola" product under the "Test product category #1 name" category
    And the admin pushes the "Regenerate menu" button
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
    And I should see "Cola" with picture

  Scenario: Admin modifies the price of a product
    Given the admin sets the "FANTA #2" price to "320 Ft"
    And the admin pushes the "Regenerate menu" button
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
    And I tap on the "FANTA #2" product
    And I should see "1 x 320 Ft" text
