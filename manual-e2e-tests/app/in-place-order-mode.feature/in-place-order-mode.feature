Feature: In place order mode features

    Scenario: select a unit that supports in place (app)
        Given I am on the login screen
        And the Admin sets the "Hamburgers" product category available in in place mode
        When I tap on the text "Continue anonymously"
        Then there is a loading screen
        And I should see the "Unit selector" screen
        When I tap on the "Késdobáló #111" unit in the list
        And I tap on the "Take away" button
        Then I should see the "Menu" screen
        When I tap on the "You can switch between ordering methods at any time." text
        Then I should see "Sorry, this product category is not available in in place mode." text
        And I tap on the "Mode selector" button
        And I tap on the "Take away" icon
        Then I should see "Please select" text
        And I tap on the "In place" button
        When I tap on the "Are you sure you want to switch to in place?" text
        And I tap on the "Yes" button
        Then I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture
        When I tap on the "Favorites" button
        Then I should see "You have not added any favorite items yet." text

    Scenario: turn off and on in place mode (admin-app-admin-app)
        Given the Admin turns OFF the "In place" mode from "Késdobáló #111"
        And the Admin clicks on the "Regnerate menu" button
        Given I am on the login screen
        When I tap on the text "Continue anonymously"
        Then there is a loading screen
        And I should see the "Unit selector" screen
        Then I should see "Find the nearest places" text
        And I should see "Take away" icon on the "Késdobáló #111" unit card
        When I tap on the "Késdobáló #111" unit in the list
        Then I should see the "Menu" screen
        Then I CLOSE the app
        When the Admin turns ON the "In place" mode from "Késdobáló #111"
        And the Admin clicks on the "Regnerate menu" button
        When I am on the unit selector screen
        And I should see "In place" icon on the "Késdobáló #111" unit card
        When I tap on the "Késdobáló #111" unit in the list
        Then I should see the "Menu" screen
        Then I CLOSE the app

    Scenario: in place product modifier visible on cart screen
        When I tap on the "Sajtburger" button
        Then I should see "Válassz méretet" text
        When I tap on the "1 db double" button
        And I tap on the "Add to cart" button
        Then I should see the "Menu" screen
        When I tap on the "MY CART (2000 Ft)" button
        And I tap on the "PAY (2000 Ft)" button
        Then I should see the "PAY" screen
        When I tap on the option "Card, SZÉP card" button
        And I tap on the "PLACE ORDER" button
        Then the qr code reader opens the camera
        When I read a seat qr code
        Then I should see the "Finding your seat..." loading screen
        And I get the text message "New Table Reserved!"
        And I should see "Successful order!" text
        When I tap on the "ALL RIGHT" button
        Then I should see the "Orders" screen

    Scenario: Create inplace order
        Given I am on the login screen
        When I tap on the text "Continue anonymously"
        Then there is a loading screen
        And I should see the "Unit selector" screen
        When I tap on the "Késdobáló #111" unit in the list
        And I tap on the "In place" button
        Then I should see the "Menu" screen
        When I tap on the "Sajtburger" button
        Then I should see "Rice" text
        And I should see "French fries" text
        And I tap on the "ADD TO CART" button
        And I tap on the "MY CART (1700 Ft)" button
        Then I should see the "CART" screen
        And I should see "+ Rice" text
        When I tap on the "PAY (1700 Ft)" button
        Then I should see the "PAY" screen
        When I tap on the option "Credit Card Payment" button
        Then I should see "Add new card" screen with a form
        When I fill out the input "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
        And I fill out the input "MM/YY" with "01/23" date
        And I fill out the "CVV" input with the "111"
        And I tap on the "SAVE CARD" button
        Then I should see the "PAY" screen
        When I tap on the "visa **** 4242" button
        And I tap on the "PLACE ORDER" button
        Then the qr code reader opens the camera
        When I read a seat qr code
        Then I should see the "Finding your seat..." loading screen
        And I get the text message "New Table Reserved!"
        And I should see "Successful order!" text
        When I tap on the "ALL RIGHT" button
        Then the "Orders" option is higlighted
        And I should see "Current orders" text
        And I should see "in place" on the order card
        When I tap on the order with "Processed"
        Then the "We have received your order" state is checked
        And the "Your order has been confirmed, everything is fine!" state is checked
        When I tap on the "DOWNLOAD RECEIPT" button
        Then I should see "szamlazz.hu" receipt
        When I tap on the "Done" button
        Then I should see "Order mode" text with "In place" text

    Scenario: Available products in in place mode
        Given I am logged in as an anonym user
        Given the Admin sets a product available only in in place order mode
        When I tap on the "Késdobáló #111" unit in the list
        Then I should see the "Please select" dialog
        When I tap on the "Take away" button
        Then I should see the "Menu" screen
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with "Only for in place" text
        When I tap on the "Mode selector" button
        Then I should see the "Please select" dialog
        When I tap on the "In place" button
        Then I should see the "Menu" screen
        And I should see "Sajtburger" with picture
        And I should see "Fishburger" with picture
        And I should see "Hamburger" with picture



