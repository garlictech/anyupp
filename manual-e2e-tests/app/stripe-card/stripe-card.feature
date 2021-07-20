Feature: Stripe Card

  Background: Login to the App and select a Unit
    Given I am on the login page
    When I tap the text "Continue anonymously" 
    Then There is a loading screen
    Then There is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen 
    And  The "Menu" option is selected on the bottom navigator

  Scenario: Add and delete a new credit card
    When I tap the "Profile" icon in the dashboard
    Then There is the profile screen
    When I tap the "Saved cards" option
    Then There is a loading screen
    Then There is card screen with a form
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with todays date
    And I fill out the "CVC" input with the "111"
    And I tap the "Add new Card" button
    Then There is a loading screen
    Then There is a dialog "Success!"
    When I discard the dialog
    Then There is a card list page
    And I should see the added Card
    When I tap the delete icon on the card
    Then There is a dialog "Are you sure?"
    When I tap the text "Delete"
    Then There is a loading screen
    Then There is card screen with a form
    When I tap the text "Saved Cards"
    Then There is the text "No payment methods saved"

  Scenario: Pay with a new card and pay with existing card
    When I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    Then There is the product details screen
    When I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the shop cart icon
    Then There is the cart screen
    When I tap the qr code icon 
    Then There is the qr code reader screen
    When I read a seat's qr code
    Then there is the finding your seat screen
    Then there is the connecting to seat screen
    Then there is the cart screen
    Then I should see the selected table and seat at the top right hand side corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I the the option "Pay by Card via Stripe (preferred)"
    Then the option "Pay by Card via Stripe (preferred)" is highlighted
    When I tap the "PLACE ORDER" button
    Then There is a loading screen
    Then There is card screen with a form
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with todays date
    And I fill out the "CVC" input with the "111"
    And I tap the checkbox "Save card for the later use"
    When I tap the button "Pay with Stripe"
    Then There is a loading screen
    Then there is the dashboard screen
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list 
    And the state of the order is "Placed"
    When I tap the "Menu" icon from the bottom navigation bar
    And I tap the "TEST CHAIN PRODUCT #2 NAME" card under "Test product category #1 name" category
    Then There is the product details screen
    When I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the shop cart icon
    Then There is the cart screen
    Then I should see the selected table and seat at the top right hand side corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I the the option "Pay by Card via Stripe (preferred)"
    Then the option "Pay by Card via Stripe (preferred)" is highlighted
    When I tap the "PLACE ORDER" button
    Then There is a loading screen
    Then There is the saved cards page
    And I should see a card with the number "4242"
    When I tap the button "Pay with Stripe"
    Then There is a loading screen
    Then there is the dashboard screen
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list 
    And the state of the order is "Placed"
    


