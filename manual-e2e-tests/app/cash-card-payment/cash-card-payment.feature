Feature: Cash and card payment

  Using the VAT form

  Background: Login to the App and select a Unit
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator

  Scenario: Pay with cash and pay with card
    When I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    When I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Credit card at register"
    Then the option "Credit card at register" is highlighted
    When I click the button next to "I want a VAT invoice"
    And I tap the "FILL INVOICE FORM" button
    Then I should see "Invoice info" page
    When I fill out the "Name/Company name" input with "E2E test Company"
    And I fill out the "Tax ID Number" input with "1234567890"
    Then the "Country" button should contain "Hungary"
    When I fill out the "Zip code" input with "1234"
    And I fill out the "City" input with "Nekeresd"
    And I fill out the "Street address" input with "Test street"
    And I fill out the "Invoice email" input with "testuser+test@anyupp.com"
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And the state of the order is "WAITING"
    When I tap the "Menu" icon from the bottom navigation bar
    When I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    And I should see the selected table and seat at the top right corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Cash at register"
    Then the option "Cash at register" is highlighted
    When I click the button next to "I want a VAT invoice"
    And I tap the "FILL INVOICE FORM" button
    Then I should see "Invoice info" page
    And I should see the form filled with the previous datas
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "2"
    And the "Orders" page is selected on the top navigator
    And the state of the order is "WAITING"
