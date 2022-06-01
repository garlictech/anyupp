Feature: Stripe Card

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap on the "Continue anonymously" text
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" option
    Then I should see the "Menu" screen
    When I tap on the "You can switch between ordering methods at any time." text
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Add and delete a new credit card
    When I tap on the "Profile" button
    Then I should see "AnonymUser" text
    When I tap on the "Saved cards" option
    And I should see the "PAYMENT" screen
    When I tap on the "Add new card" button
    And I fill out the input "xxxx xxxx xxxx xxxx" with "5555 5555 5555 4444"
    And I fill out the input "MM/YY" with "12/25"
    And I fill out the "CVC" input with the "111"
    And I tap on the "SAVE CARD" button
    Then there is a loading screen
    Then I should see "Success! Card added successfully!" text
    When I tap on the "OK" button
    Then I should see the "PAYMENT" screen
    And I should see the added card with "mastercard **** 4444"
    When I swipe the "mastercard **** 4444" left
    And I tap on the "delete" icon
    Then there is a dialog "Delete credit card? This will delete the credit card from your payment methods"
    When I tap on the "Ok" text
    Then there is a loading screen
    And I should see the "PAYMENT" screen
    And I should see "Add new card" text

  Scenario: Pay with a new card then pay with the saved card
    When I tap on the "Fishburger" card under "Hamburgers" category
    Then I should see "sea fish burger" text
    And I should see "1 x 1700 Ft" text
    When I tap on the "plus" button
    Then I should see "2 x 1700 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (3400 Ft)" button
    Then I should see the "Cart" screen
    And I should see "in place" text
    And I should see "+ French fries" text
    When I tap on the "PAY (3400 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Credit Card Payment"
    And I should see the "Add new card" screen
    When I fill out the input "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input "MM/YY" with "01/23" date
    And I fill out the "CVC" input with the "111"
    And I tap on the "SAVE CARD" button
    Then I should see the "PAYMENT" screen
    When I tap on the "visa **** 4242" option
    And I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair ..." loading screen
    And I get the notification message "New Table Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then I should see the "Orders" screen
    And I should see "Current orders" text
    And I should see "in place" on the order card
    And I should see "3400 Ft" on the order card
    And I should see the 3 digit number of the created order
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything's fine!" state is checked
    And I should see "Total cost 3400 Ft" text
    Then I should see "Order Num" with 3 numbers
    And I should see "In place" text
    When the admin set the state of order to "PROCESSING"
    Then I should see "#001 We are placing your order" popup
    When I tap on the "OK" button
    And the "We're preparing your order." state is highlighted
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "Számlázz.hu" receipt
    And I should see "3400 HUF" text
    When I tap on the "Done" button
    And the admin set the state of order to "READY"
    Then I should see "#001 Your order is served" popup
    When I tap on the "OK" button
    Then I should see the "Your order is complete, we will serve it/you can pick it up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then I should see "Order served" text
    When I tap on the "back arrow" button
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    And I should see "Served" on the order card
    # Scenario: second order with saved card, from order list
    When I tap on the "Discover menu" button
    And I tap on the "Beers" category
    And I tap on the "Dreher" card
    And I select the "3 dl" option
    Then I should see "1 x 500 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (500 Ft)" button
    Then I should see the "Cart" screen
    And I should see "In place" text
    And I should see "+ Room temperature" text
    When I tap on the "PAY (500 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the "visa **** 4242" option
    When I tap on the "PLACE ORDER" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then I should see the "Orders" screen
    And I should see "Current orders" text
    When I tap on the order with "#002"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    And I should see "Total cost 500 Ft" text
    When I tap on the "back arrow" button
    When the admin set the state of order to "PROCESSING"
    Then I should see "#002 We are placing your order" popup
    When I tap on the "OK" button
    And the "We're preparing your order." state is highlighted
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "Számlázz.hu" receipt
    And I should see "3400 HUF" text
    When I tap on the "Done" button
    And the admin set the state of order to "READY"
    Then I should see "#002 Your order is served" popup
    When I tap on the "OK" button
    Then I should see the "Your order is complete, we will serve it/you can pick it up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    When I tap on the order with "500 Ft"
    Then I should see "Order served" text
