Feature: Error messages

  Scenario: Login error message
    Given I am on the login screen
    And the language is set to EN
    When I click on the mail icon
    And I fill out the "Email" input with "testuser+test@anyipp.com"
    And I fill out the "Password" input with "asd"
    Then I should see "password must be at least 8 digits long" red message
    When I fill out the "Password" input with "asdfghjk"
    Then I should see "must have a number, an upper, a lower case letter" red message
    When I fill out the "Password" input with "asDF1234"
    And I tap the "Login" button
    Then I should see the message "Sign up error"
    And I should see the message "Invalid user or password. Try again."
    And I tap the "Close" button

  Scenario: When a unit is not accepting orders
    # about the #1160 issue
    Given the admin set the "ORDERS BLOCKED"
    And I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then the "Menu" option is selected on the bottom navigator
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    When I tap the cart icon
    And I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Credit card at register"
    # or any option
    And I tap the "PLACE ORDER" button
    Then I should see the message "Unit is closed"
    Then I should see the message "Unit is not aaccepting orders right now. Try it later!"
    And I tap the "Close" button
