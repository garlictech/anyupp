Feature: Orders menu feature

    Scenario: No active orders
        Given I am on the login screen
        And the language is set to EN
        When I tap the text "Continue anonymously"
        Then there is a loading screen
        When I tap the "Késdobáló #111" unit in the list
        And I tap the "In place" button
        Then there is the "Menu" screen
        When I tap on the "Orders" button
        Then I should see "No active orders placed yet" dialog
        When I tap on the "Discover menu" button
        Then I should see the "Menu" screen
