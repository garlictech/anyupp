Feature: Sold out items in the app

    Scenario: Visible sold out items in the app
        Given the Admin set the "Hamburger" to sold out and still visible
        Given I am on the login screen
        And the language is set to EN
        When I tap the text "Continue anonymously"
        Then there is a loading screen
        And there is the "Unit selector" screen
        When I tap on the "Késdobáló #111" unit in the list
        And I tap on the "In place" button
        Then I should see the "Menu" screen
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with "Sold out" text
        And I should see "Hamburger" is disabled
        When I tap on the "Hamburger" button
        Then I should see "Hamburger laktató szendvics" description
        And I should see "A termék sajnos elfogyott" text
        And I should see the "KOSÁRBA TESZEM" button is disabled

    Scenario: Sould out item is not visible in the app
        Given the Admin set the "Hamburger" to sold out and not visible
        Given I am on the login screen
        And the language is set to EN
        When I tap the text "Continue anonymously"
        Then there is a loading screen
        And there is the "Unit selector" screen
        When I tap on the "Késdobáló #111" unit in the list
        And I tap on the "In place" button
        Then I should see the "Menu" screen
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should not see "Hamburger" item

