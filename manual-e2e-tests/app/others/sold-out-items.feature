Feature: Sold out items in the app

  Background: Basic, in the Kesdobalo#111
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen

  Scenario: Visible sold out items in the app
    Given the Admin set the "Hamburger" to sold out
    And the Admin set the sold out policy to "Visible as faded if sold out"
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    And I should see a "Sold out" text on the "Hamburger" card
    And I should see "Hamburger" is disabled
    When I tap on the "Hamburger" button
    Then I should see "Unfortunately, this product is sold out." text
    And I should see the "ADD TO CART" button is disabled

  Scenario: Sould out item is not visible in the app
    Given the Admin set the "Hamburger" to sold out
    And the Admin set the sold out policy to "Not visible if sold out"
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should NOT see "Hamburger" item
