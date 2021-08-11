Feature: Stripe Card

  Background: Login to the App and select a Unit
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator

  Scenario: Add and delete a new credit card
    When I tap the "Profile" icon in the dashboard
    Then there is the profile screen
    When I tap the "Saved cards" option
    Then there is a loading screen
    Then there is "New Card" screen with a form
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with todays date
    And I fill out the "CVC" input with the "111"
    And I tap the "Add new Card" button
    Then there is a loading screen
    Then there is a dialog "Success!"
    When I discard the dialog
    Then there is a card list page
    And I should see the added Card
    When I tap the delete icon on the card
    Then there is a dialog "Are you sure?"
    When I tap the "Delete" text
    Then there is a loading screen
    And there is card screen with a form
    When I tap the text "Saved Cards"
    Then there is the text "No payment methods saved"

  # about the issue #244 and #396
  Scenario: Pay with a new card then pay with the added card
    When I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    Then there is the product details screen
    When I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    When I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    And I should see the selected table and seat at the top right corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Pay by Card via Stripe (preferred)"
    Then the option "Pay by Card via Stripe (preferred)" is highlighted
    When I tap the "PLACE ORDER" button
    Then there is a loading screen
    And there is "New Card" screen with a form
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with "01/23" date
    And I fill out the "CVC" input with the "111"
    And I tap the checkbox "Save card for later use"
    And I tap the button "Pay with Stripe"
    Then there is a loading screen
    And I should get the "Payment success!" message
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And there is "1" order in the list
    And the state of the order is "Placed"
    When I tap the "Menu" icon from the bottom navigation bar
    And I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then the cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    And I should see the selected table and seat at the top right corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I the the option "Pay by Card via Stripe (preferred)"
    Then the option "Pay by Card via Stripe (preferred)" is highlighted
    When I tap the "PLACE ORDER" button
    Then there is a loading screen
    And There is the "Saved cards" page
    And I should see the higlighted card with the number "4242"
    When I tap the button "Pay with Stripe"
    Then There is a loading screen
    And I should get the "Payment success!" message
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "2"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list
    And the state of the order is "PLACED"
    And the admin set it to "PROCESSING"
    And I click on the "Show" text
    Then I should see the receipt of the order
    When I click on the "Done" button
    Then I should see my order on the "Orders" tab
    And the admin set it to "READY"
    And the admin set it to paid
    Then I should see the text "No active order placed yet"
    When I swipe to the "History" tab
    Then I should see the paid order

  Scenario: Pay without saving the card
    # about the #1250 issue, issue #244
    When I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Cart" screen
    When I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    And I should see the selected table and seat at the top right corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Pay by Card via Stripe (preferred)"
    Then the option "Pay by Card via Stripe (preferred)" is highlighted
    When I tap the "PLACE ORDER" button
    Then there is a loading screen
    When I fill out the input with id "Card number" with "5555 5555 5555 4444"
    And I fill out the input with id "Expiration Date" with "11/22" date
    And I fill out the "CVC" input with the "123"
    When I tap the button "Pay with Stripe"
    Then there is a loading screen
    And I should get the "Payment success!" message
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list
    And the state of the order is "PLACED"
    And the admin set it to "PROCESSING"
    And I click on the "Show" text
    Then I should see the receipt of the order
    When I click on the "Done" button
    Then I should see my order on the "Orders" tab
    And the admin set it to "READY"
    And the admin set it to paid
    Then I should see the text "No active order placed yet"
    When I swipe to the "History" tab
    Then I should see the paid order
