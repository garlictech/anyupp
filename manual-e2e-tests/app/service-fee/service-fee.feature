Feature: Service fee on app

  Background: Login and unit selection
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture

  Scenario: service fee on different screens
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    Then I should see "Fanta #2 description" text
    Then I should see "Az ár szervizdíjat nem tartalmaz." text
    When I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (596 Ft)" button
    Then there is the "Cart" screen
    And I should see "Service fee" text
    And I should see "...Ft (5%)" text
    When I tap the "PAY (596 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    When I tap the "PAY (596 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I tap the option "Credit card at my table to my server + SZÉP card"
    And I should see "PLACE ORDER" text
    And the "Orders" option is higlighted
    Then I should see "Current orders" text
    When I tap on the order with "Processing"
    Then I should see "Order status" text
    And I should see "Az ár 5% szervizdíjat tartalmaz." text

  Scenario: Service fee in szamlazz.hu
    Given I am on the "Menu" screen
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    Then I should see "Fanta #2 description" text
    When I tap the "ADD TO CART" button
    Then there is the "Menu" screen
    When I tap the "MY CART (596 Ft)" button
    Then there is the "Cart" screen
    And I tap the "PAY (596 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    Then I should see "2 x 298 Ft" text
    When I tap the "PAY (596 Ft)" button
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
    And I should see "596 Ft" on the order card
    And I should see the date of the created order
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    And I should see "Total cost 596 Ft" text
    When I scroll down to the bottom
    Then I should see "Order Num" with 6 numbers
    And I should see "Takeaway" text
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Message from AnyUpp! Your order is being processed."
    And the "We are just making the ordered items." state is highlighted
    When I tap the "DOWNLOAD RECEIPT" button
    Then I should see "Számlázz.hu" receipt
    And I should see "Service fee ...Ft" text
