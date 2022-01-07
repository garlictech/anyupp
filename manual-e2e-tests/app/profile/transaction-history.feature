Feature: Transaction History

  Scenario: Transaction history listing
    Given I have 3 order historys at unit "Késdobáló #111"
    And I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "Profile" icon at the bottom navigator
    Then there is the profile screen
    When I tap the "Transactions" option
    Then there is the "Transactions" screen
    And I check if there are 3 cards
    And I check if the date of the cards are in descending order from top to down
