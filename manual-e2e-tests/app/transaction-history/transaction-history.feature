Feature: Transaction History

  Background: Login to the App and select a Unit
    Given I am on the login page
    When I tap the text "Continue anonymously" 
    Then There is a loading screen
    Then There is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen 
    And  The "Menu" option is selected on the bottom navigator

  Scenario: "Purchase an item three times in a row"
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
    When I tap the button "Pay with Stripe"
    Then There is a loading screen
    Then there is the dashboard screen
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And there is an order in the list 
    And the state of the order is "Placed"
    Then I write down the id number at the top left corner of the card
    Then I tap the "Menu" option on the bottom navigator
    And  The "Menu" option is selected on the bottom navigator
    Then I repeat these steps until I have 3 ids written
    When I tap the "Profil" icon at the bottom navigator
    Then there is the profile screen
    When I tap the "Transactions" option
    Then there is the transactions screen
    When I pull the screen down
    Then there is a loading screen
    Then there is a tranasction list
    Then I check if there are three cards
    Then I check if the date at the top left corner of the cards are in descending order from top to down
    