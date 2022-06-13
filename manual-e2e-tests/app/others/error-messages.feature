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
    And I tap the "ALL RIGHT" button

  Scenario: When a unit is not accepting orders
    Given the admin set the "ORDERS BLOCKED"
    When I tap the text "Continue anonymously"
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    And I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (1700 Ft)" button
    Then there is the "PAY" screen
    When I tap the option "Card, SZÉP card"
    And I tap the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Order failed. An error has occured, please contact our team for assistance." message
    And I tap the "ALL RIGHT" button

  Scenario: Stripe payment error message
    When I am logged in "Késdobáló #111" unit as an anonym user
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (1700 Ft)" button
    Then there is the "PAY" screen
    When I tap the option "Credit Card Payment"
    Then there is the "Add a new card" screen with a form
    When I fill out the input with id "xxxx xxxx xxxx xxxx" with "1111 1111 1111 1111"
    And I fill out the input with id "MM/YY" with "01/23" date
    And I fill out the "CVV" input with the "1111"
    And I tap the button "SAVE CARD"
    Then I should see "The card information you entered is invalid. Please check it again!" dialog
    When I tap on the "OK" button
    Then I should see a red frame around the card number
    When I tap on the "1111 1111 1111 1111" input
    And I fill out the input with "6011 1111 1111 1117"
    # it is a Discover test card which is only accepted in the US
    And I tap the button "SAVE CARD"
    Then there is a loading screen
    And I should see the "Operation failed Your card could not be added" popup
    And I tap the "OK" button
    Then I should see "Order failed" popup
    And I tap the "OK" button