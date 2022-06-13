Feature: Service fee on app

  Background: Login and unit selection
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Service fee not included in price but applicable
    Given the admin set the service fee type to "Fee not included in prices but applicable"
    Given the admin set the service fee to "10%"
    When I tap the "Sajtburger" card under "Hamburgers" category
    Then I should see "Sajtburger sajtos szendvics" text
    Then I should see "Prices do not include 10% service fee" text
    When I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    And I should see "Service fee" text
    And I should see "170 Ft (10%)" text
    When I tap the "PAY (1870 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the "Cash" button
    Then I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair..." loading screen
    And I get the text message "New Seat Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    And I should see "Successful order!" popup
    When I tap on the "OK" button
    Then I should see "Current orders" text
    When I tap on the order with "Processing"
    Then I should see "Order status" text
    And I should see "Service fee 1 x 170 Ft" text

  Scenario: Service fee included in price
    Given the admin set the service fee type to "Fee included in all prices"
    Given the admin set the service fee to "10%"
    When I tap the "Sajtburger" card under "Hamburgers" category
    Then I should see "Sajtburger sajtos szendvics" text
    Then I should see "The price includes a service fee" text
    When I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    And I should NOT see "Service fee" text
    When I tap the "PAY (1700 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the "Cash" button
    Then I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair..." loading screen
    And I get the text message "New Seat Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    And I should see "Successful order!"
    When I tap on the "OK" button
    Then I should see "Current orders" text
    When I tap on the order with "Processing"
    Then I should see "Order status" text
    And I should see "Order details" text
    And I should see "The price contains 10% service fee." text

  Scenario: Service fee in szamlazz.hu
    Given I am on the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    Then I should see "Sajtburger sajtos szendvics" text
    When I tap the "ADD TO CART" button
    Then there is the "Menu" screen
    When I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    And I tap the "PAY (1700 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Credit Card Payment"
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
    Then I should see the "finding table and chair..." loading screen
    And I get the text message "New Table Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    And I should see "Successful order!"
    When I tap on the "OK" button
    Then I should see "Current orders" text
    When I tap on the order with "Processed"
    Then I should see "Ordes status" text
    When I tap the "DOWNLOAD RECEIPT" button
    Then I should see "Számlázz.hu" receipt
    And I should see "Service fee 170 Ft" text
