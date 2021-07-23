Feature: Transaction History

  Background: Logged in with 3 order history
    Given I am logged into the app
    Given I have three order historys at unit "Késdobáló #111"

  Scenario: "Transaction history listing"

    When I tap the text "Késdobáló #111" 
    Then there is the dashboard screen
    Then I tap the "Menu" option on the bottom navigator
    And  The "Menu" option is selected on the bottom navigator
    When I tap the "Profil" icon at the bottom navigator
    Then there is the profile screen
    When I tap the "Transactions" option
    Then there is the transactions screen
    When I pull the screen down
    Then there is a loading screen
    Then there is a tranasction list
    Then I check if there are three cards
    Then I check if the date at the top left corner of the cards are in descending order from top to down
    