Feature: Allergens info in Profile menu

    Scenario: Allergens info
        Given I am on the login screen
        And the language is set to EN
        When I tap the text "Continue anonymously"
        Then there is a loading screen
        And there is the "Unit selector" screen
        When I tap on the "Késdobáló #111" unit in the list
        And I tap on the "In place" button
        Then I should see the "Menu" screen
        When I tap on the "Profile" button
        Then I should see "AnonymUser" text
        When I tap on the "Allergens" button
        Then I should see the "ALLERGENS" screen
        And I should see 14 diiferent icons
        And I should see a discription
