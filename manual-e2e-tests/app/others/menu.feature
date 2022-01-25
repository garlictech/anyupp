Feature: Update menu and see the changes in the app

    Background: Login
        Given I am on the login screen
        And the language is set to EN
        When I tap the text "Continue anonymously"
        Then there is a loading screen
        And there is the unit selection screen
        When I tap the "Késdobáló #111" unit in the list
        And I tap the "Take away" button
        Then I am on the "Menu" screen

    Scenario: The Menu and 1 sold out item
        Given the admin sets the "Fishburger" to sold out
        Then I should see the logo on the screen
        When I tap on the order mode icon
        When I tap on the qr code icon
        Then I should see 2 categories
        Then I should see "Favourites" category
        Then the "Hamburgers" category is selected
        Then I should see "Sajtburger" with picture
        And I should see "description" on the "Sajtburger" card
        And I should see "price" on the "Sajtburger" card
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture
        When I tap on the "Sajtburger" product
        When I tap on the "Favourites" category
        Then I should see "" text
        Then I should see the "Fishburger" is sold out
        When I tap on the "exit" button
        Then I am on the "Unit selector" screen

    Scenario: Admin set the product to inactive
        Given the admin set the "Sajtburger" product to INACTIVE
        And the admin pushes the "Regenerate menu" button
        When I tap the "You can switch between ordering methods at any time." text
        Then I should see "Fishburger" with picture
        And I should see "Hamburger" with picture
        And I should NOT see "Sajtburger"
        When the admin set the "Sajtburger" product to ACTIVE
        And the app user closes the App
        And the app user opens the App
        Then there is the unit selection screen
        When I tap the "Késdobáló #111" unit in the list
        And I tap the on "Take away" button
        Then I am on the "Menu" screen

    Scenario: Admin set all the products to inactive
        Given the admin set the "Fishburger" product to INACTIVE
        Given the admin set the "Sajtburger" product to INACTIVE
        Given the admin set the "Hamburger" product to INACTIVE
        And the admin pushes the "Regenerate menu" button
        When I tap the "You can switch between ordering methods at any time." text
        Then I should see "Non-alcoholic drink" product category
        And I should see "Beers" product category
        And I should NOT see "Hamburgers" product category
        When the admin set the "Sajtburger" product to ACTIVE
        When the admin set the "Fishburger" product to ACTIVE
        When the admin set the "Hamburger" product to ACTIVE
        And the anyupp user closes the App
        And the anyupp user opens the App
        Then there is the unit selection screen
        When I tap the "Késdobáló #111" unit in the list
        And I tap the on "Take away" button
        Then I am on the "Menu" screen
        Then I should see "Hamburgers" product category
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture

    Scenario: Admin adds a new product
        Given the admin adds "Vegaburger" product under the "Hamburgers" category
        And the admin pushes the "Regenerate menu" button
        When I tap the "You can switch between ordering methods at any time." text
        Then I should see "Sajtburger" with picture
        And I should see "Vegaburger" with picture

    Scenario: Admin modifies the price of a product
        Given the admin sets the "Sajtburger" price to "2000 Ft"
        And the admin pushes the "Regenerate menu" button
        When I tap the "You can switch between ordering methods at any time." text
        Then I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture
        And I tap on the "Sajtburger" product
        And I should see "1 x 2000 Ft" text