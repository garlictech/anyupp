Feature: Takeaway orders feature

  Scenario: select a unit that supports takeaway (app)
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "Sorry, this product category is not available in in place mode." text
    And I tap the "In place" icon
    Then I should see "Please select" text
    And I tap the "Take away" button
    When I tap the "Are you sure you want to switch to takeaway?" text
    And I tap the "Yes" button
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
    When I tap the "Favorites" button
    Then I should see "You have not added any favorite items yet." text

  Scenario: turn off and on takeaway mode (admin-app-admin-app)
    Given the Admin turns OFF the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    Then I should see "Find the nearest places" text
    And I should see "In place" icon on the "Késdobáló #111" unit card
    When I tap the "Késdobáló #111" unit in the list
    Then there is the "Menu" screen
    When I CLOSE the app
    When the Admin turns ON the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    When I am on the unit selector screen
    And I should see "Take away" icon on the "Késdobáló #111" unit card
    When I tap the "Késdobáló #111" unit in the list
    Then there is the "Menu" screen
    When I CLOSE the app

  Scenario: takeaway product modifier visible on cart screen
    When I tap on the "Fanta #2" button
    Then I should see "Modifier comp set" text
    When I tap on the "CLASSIC" button
    And I tap on the "Add to cart" button
    Then I should see the "Menu screen"
    When I tap on the "MY CART (298 Ft)" button
    When I tap the "PAY (298 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    When I tap on the "PAY (298 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I tap the option "Credit card at my table to my server + SZÉP card"
    And I should see "PLACE ORDER" text

  Scenario: Create takeaway order
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap on the "FANTA #2" button
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (298 Ft)" button
    Then I should see the cart screen
    When I tap the "PAY (298 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    When I tap on the "PAY (298 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I tap the option "Online Card payment via Stripe (preferred)"
    And I tap the "PLACE ORDER" button
    Then there is a loading screen
    And there is "New Card" screen with a form
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with "01/23" date
    And I fill out the "CVC" input with the "111"
    And I tap the checkbox "Save card for later use"
    And I tap the "Pay with Stripe" button
    Then there is a loading screen
    And I get the text message "Payment success!"
    And the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see "takeaway" on the order card
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "szamlazz.hu" receipt
    When I tap the "Done" button
    Then I should see "Order mode" text with "Takeaway" text
