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
    When I tap the "Profile" icon
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

  Scenario: Pay with a new card then pay with the saved card
    When I tap the "FANTA #2" card under "Test product category #1 name" category
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
    And I should see the date of the created order
    Then in the app the order should be in "PLACED" state
    When the admin set the state of order to "PROCESSING"
    Then in the app the order should be in "PROCESSING" state
    And I tap on the "Show" text
    Then I should see the receipt of the order
    When I tap on the "Done" button
    Then I should see my order on the "Orders" tab
    When the admin set the state of order to "READY"
    Then in the app the order should be in "READY" state
    When the admin set the state of order to "SERVED"
    Then I should see the text "No active order placed yet"
    When I swipe to the "History" tab
    Then I should see the "SERVED" label on the paid order
    And I should see "Load more..." at the bottom of the orders
    # Scenario: second order with the saved card
    When I tap the "Menu" icon from the bottom navigation bar
    And I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Extra comp set" button
    And I select the "CLASSIC" modifier
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
    When I tap the button "Delete"
    Then I should see "Are you sure? This card will be deleted" text
    When I tap the button "Cancel"
    And I tap the button "Pay with Stripe"
    Then There is a loading screen
    And I should get the "Payment success!" message
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "2"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list
    And I should see the date of the created order
    Then in the app the order should be in "PLACED" state
    When the admin set the state of order to "PROCESSING"
    Then in the app the order should be in "PROCESSING" state
    And I tap on the "Show" text
    Then I should see the receipt of the order
    When I tap on the "Done" button
    Then I should see my order on the "Orders" tab
    When the admin set the state of order to "READY"
    Then in the app the order should be in "READY" state
    When the admin set the state of order to "SERVED"
    Then I should see the text "No active order placed yet"
    When I swipe to the "History" tab
    Then I should see the "SERVED" label on the paid order
    And I should see "Load more..." at the bottom of the orders
    When I tap the "Profile" icon
    And I tap the "Transactions" option
    And I should see the latest order
    And I tap its "Show" text
    Then I sgould see the price "298 HUF"
    Then I should see the receipt of the order
    When I tap the "Done" text
    Then I should be on the "Transactions" list

  Scenario: Pay without saving the card and use the VAT form
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Modifier comp set" button
    And I select the "CLASSIC" modifier
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
    Then in the app the order should be in "PLACED" state
    When the admin set the state of order to "PROCESSING"
    Then in the app the order should be in "PROCESSING" state
    And I tap the "Show" text
    When I tap the "Megnézem" text
    Then I should see the receipt of the order
    When I tap the back arrow
    Then I should see my order on the "Orders" tab
    When the admin set the state of order to "READY"
    Then in the app the order should be in "READY" state
    When the admin set the state of order to "SERVED"
    Then I should see the text "No active order placed yet"
    When I tap the "History" tab
    Then I should see the "SERVED" label on the paid order
    And I should see "Load more..." at the bottom of the orders
    When I tap the "Profile" icon
    And I tap the "Transactions" option
    And I should see the latest order
    And I tap the "Show" text
    Then I sgould see the price "298 HUF"
    When I tap the "Megnézem" text
    Then I sgould see the price "298 HUF"
    Then I should see the receipt of the order
    When I tap the back arrow
    Then I should be on the "Transactions" list
