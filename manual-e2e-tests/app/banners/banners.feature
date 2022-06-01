Feature: Banner appearance

    Scenario: Banner in the Menu screen
        Given the admin upload a banner to "Késdobáló #111" unit
        And I am on the login screen
        When I tap on the "Késdobáló #111" unit card
        And I tap on the "In place" button
        Then I should see the "Menu" screen
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture
        And I should see a banner in a random place
        When I tap on the "X" button on the banner
        Then I should not see the banner
        When I pull the screen to refresh
        Then I should see the banner
        When I tap on the "X" button on the banner
        And I tap on the "Non-alcoholic drinks" product category
        Then I should see "Coca-Cola" with picture
        And I should see "Sprite" with picture
        And I should see "Fanta" with picture
        And I should see a banner
        When I tap on the "Hamburgers" product category
        Then I should not see the banner
        When I pull the screen to refresh
        Then I should see the banner