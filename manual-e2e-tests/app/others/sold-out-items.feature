Feature: Sold out items in the app

  Background: Basic, in the Kesdobalo#111
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen

  Scenario: Visible sold out items in the app
    Given the Admin set the "Hamburger" to sold out and still visible
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    And I should see a "Sold out" text on the "Hamburger" card
    And I should see "Hamburger" is disabled
    When I tap on the "Hamburger" button
    Then I should see "A termék sajnos elfogyott" text
    And I should see the "KOSÁRBA TESZEM" button is disabled

  Scenario: Sould out item is not visible in the app
    Given the Admin set the "Hamburger" to sold out and not visible
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should NOT see "Hamburger" item
