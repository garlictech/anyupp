Feature: Transaction History

  Background: Logged in with 3 order history
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator
    Given I have three order historys at unit "Késdobáló #111"

  Scenario: Transaction history listing
    When I tap the "Profile" icon at the bottom navigator
    Then there is the profile screen
    When I tap the "Transactions" option
    Then there is the transactions screen
    When I pull the screen down
    Then there is a tranasction list
    And I check if there are three cards
    And I check if the date at the top left corner of the cards are in descending order from top to down
