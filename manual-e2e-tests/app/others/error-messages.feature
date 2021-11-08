Feature: Error messages

  Background: 2 steps
    Given I am on the login screen
    And the language is set to EN

  Scenario: Login error messages
    When I click on the mail icon
    And I fill out the "Email" input with "testuser+test@anyupp.com"
    And I fill out the "Password" input with "asd"
    And I tap the "Login" button
    Then I should see "password must be at least 8 digits long" red message
    When I fill out the "Password" input with "asdfghjk"
    And I tap the "Login" button
    Then I should see "must have a number, an upper, a lower case letter" red message
    When I fill out the "Password" input with "asDF1234"
    And I tap the "Login" button
    Then I should see the "Sign up error Invalid user or password. Try again." message
    And I tap the "Close" button

  Scenario: When a unit is not accepting orders
    Given the admin set the "ORDERS BLOCKED"
    When I tap the text "Continue anonymously"
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    And I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (298 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (298 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    When I tap the "PAY (298 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I tap the option "Credit card at my table to my server + SZÉP card"
    And I tap the "PLACE ORDER" button
    Then I should see the "Unit is closed Unit is not aaccepting orders right now. Try it later!" message
    And I tap the "Close" button

  Scenario: Stripe payment error message
    When I tap the text "Continue anonymously"
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (298 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (298 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    When I tap the "PAY (298 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I tap the option "Online Card payment via Stripe (preferred)"
    When I tap the "PLACE ORDER" button
    Then there is a loading screen
    And there is "New Card" screen with a form
    When I fill out the input with id "Card number" with "1111 1111 1111 1111"
    And I fill out the input with id "Expiration Date" with "01/21" date
    And I fill out the "CVC" input with the "1111"
    And I tap the button "Pay with Stripe"
    And I should see "Card number is invalid" red message
    And I should see "Card expirity date invalid" red message
    And I should see "Card CVC is invalid" red message
    When I fill out the input with id "Card number" with "6011 1111 1111 1117"
    # it is a Discover test card which is only accepted in the US
    And I fill out the input with id "Expiration Date" with "01/23" date
    And I fill out the "CVC" input with the "111"
    And I tap the button "Pay with Stripe"
    Then there is a loading screen
    And I should see the "Error An error happened during the process!" message
    And I tap the "Close" button
