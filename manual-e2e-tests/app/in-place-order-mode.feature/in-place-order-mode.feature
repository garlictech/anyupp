Feature: In place order mode feature

  Background: Background
    Given I am on the login screen
    And the Admin sets the "Hamburgers" product category available in in place mode
    When I tap on the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" button
    Then I should see the "Menu" screen

  Scenario: select a unit that supports in place (app)
    Given the Admin sets "Hamburgers" product category available only in in place mode
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    And I tap on the "Mode selector" button
    Then I should see "Please select" text
    And I tap on the "Take away" button
    Then I should see "Sorry, this category is not available in takeaway mode." text

  Scenario: turn off/on in place mode (admin-app-admin-app)
    Given the Admin turns OFF the "In place" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    When I tap on the back arrow button
    Then I should see "Take away" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    Then I should see the "Menu" screen
    When I tap on the back arrow button
    And the Admin turns ON the "In place" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    And I pull up the screen to refresh the app
    Then I should see "In place" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" button
    Then I should see the "Menu" screen

  Scenario: in place product modifier visible on cart screen
    When I tap on the "Sajtburger" button
    And I tap on the "Boiled potato" modifier
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (1700 Ft)" button
    Then I should see the "CART" screen
    And I should see "+ Boiled potato" text

  Scenario: Create inplace order
    When I tap on the "Sajtburger" button
    And I tap on the "Rice" button
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (1700 Ft)" button
    Then I should see the "CART" screen
    And I should see "+ Rice" text
    When I tap on the "PAY (1700 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Credit Card Payment" button
    Then I should see "Add new card" screen with a form
    When I fill out the input "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input "MM/YY" with "01/23" date
    And I fill out the "CVV" input with the "111"
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
    And I should see "in place" on the order card
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "szamlazz.hu" receipt
    When I tap on the "Done" button
    Then I should see "Order mode" text with "In place" text

  Scenario: Available products in in place mode
    Given the Admin sets "Hamburger" product available only in in place order mode
    When I pull the screen to refresh the app
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with "Only in place" text
    When I tap on the "Hamburger" button
    Then I should see the "ADD TO CART" button is disabled
    And I shpuld see "This product is only available for local consumption."
    When I tap on the "X" button
    And I tap on the "Mode selector" button
    Then I should see the "Please select" dialog
    When I tap on the "In place" button
    Then I should see the "Menu" screen
    And I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
