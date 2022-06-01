Feature: Takeaway orders feature

  Background: login
    Given I am on the login screen
    When I tap on the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Unit selector" screen
    Then I should see "Find the nearest places" text
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "Take away" button
    Then I should see the "Menu" screen

  Scenario: select a unit that supports takeaway
    Given the Admin sets "Hamburgers" product category available only in take away mode
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    And I tap on the "Take away" icon
    Then I should see "Please select" text
    And I tap on the "In place" button
    Then I should see "Sorry, this category is not available in in place mode." text

  Scenario: turn off and on takeaway mode (admin-app-admin-app)
    Given the Admin turns OFF the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    When I tap on the back arrow button
    Then I should see "In place" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    Then I should see the "Menu" screen
    When I tap on the back arrow button
    When the Admin turns ON the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    And I pull up the screen to refresh the app
    Then I should see "Take away" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "Take away" button
    Then I should see the "Menu" screen

  Scenario: Create takeaway order
    When I tap on the "Sajtburger" button
    And I tap on the "Frenc fries" button
    And I tap on the "Add to cart" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (1700 Ft)" button
    # takeaway product modifier visible on cart screen
    Then I should see "+ French fries" text
    When I tap on the "PAY (1700 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the "Card, SZÉP card" button
    Then I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair ..." loading screen
    And I get the notification message "New Table Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then I should see the "Orders" screen
    And I should see "Current orders" text
    And I should see "takeaway" on the order card
    When I tap on the order with "Processing"
    Then I should see "Order mode" text with "Takeaway" text

  Scenario: Create takeaway order
    And I tap on the "Take away" button
    Then I should see the "Menu" screen
    When I tap on the "Sajtburger" button
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (1700 Ft)" button
    Then I should see the "CART" screen
    When I tap on the "PAY (1700 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Credit Card Payment" button
    Then I should see "Add new card" screen with a form
    When I fill out the input "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input "MM/YY" with "01/23" date
    And I fill out the "CVC" input with the "111"
    And I tap on the "SAVE CARD" button
    Then I should see the "PAYMENT" screen
    When I tap on the "visa **** 4242" button
    And I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair ..." loading screen
    And I get the notification message "New Table Reserved!"
    And I should see "Table: #01, Chair: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see "take away" on the order card
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "szamlazz.hu" receipt
    When I tap on the "Done" button
    Then I should see "Order mode" text with "Take away" text

  Scenario: Packaging fee
    When I tap on the "Sajtburger" button
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (1200 Ft)" button
    Then I should see the cart screen
    And I should see "Sajtburger normal" text
    And íi should see "Packaging fee 0 Ft" text with "takeaway" icon
    When I tap on the "PAY (1200 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Cash" button
    And I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair ..." loading screen
    And I get the notification message "New Table Reserved!"
    And I should see "Table: #01, Chair: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see "take away" on the order card
    When I tap on the order with "Processed"
    Then I should see the "Order status" text
    And I should see "Order details" text
    And I should see "Sajtburger" text with "1200 Ft"
    And I should see "Packaging fee" text with "0 Ft"
