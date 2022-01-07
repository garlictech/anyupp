Feature: Profile menu features

    Scenario: About us page
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
        And I should see "About" option
        When I tap on the "About" button
        Then I should see the "AnyUpp" logo
        And I should see a long description
        When I tap on the back arrow
        Then I should see the "Profile" menu

    Scenario: Terms and conditions info
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
        And I should see "Regulations" option
        When I tap on the "Regulations" button
        And the app opens the "anyupp.com" webpage
        Then I should see "A CyBERG Corp. Nyrt. adatkezelési tájékoztatója" text
        And I should see a long description

    Scenario: Log out from Profile
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
        And I sould see "Logout" option
        When i tap on the "Logout" button
        Then I should see "Confirm Logout Are you sure to want to logout?" dialog
        When I tap on the "Logout" button
        Then I should see the "Login" screen