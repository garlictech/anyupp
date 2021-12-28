Feature: Takeaway orders feature

  Scenario: select a unit that supports takeaway (app)
    Given I am on the login screen
    And the Admin sets the "Hamburgers" product category available in take away mode
    When I tap on the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" button
    Then I should see the "Menu" screen
    When I tap on the "You can switch between ordering methods at any time." text
    Then I should see "Sorry, this product category is not available in in place mode." text
    And I tap on the "In place" icon
    Then I should see "Please select" text
    And I tap on the "Take away" button
    When I tap on the "Are you sure you want to switch to takeaway?" text
    And I tap on the "Yes" button
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    When I tap on the "Favorites" button
    Then I should see "You have not added any favorite items yet." text

  Scenario: turn off and on takeaway mode (admin-app-admin-app)
    Given the Admin turns OFF the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    Given I am on the login screen
    When I tap on the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Unit selector" screen
    Then I should see "Find the nearest places" text
    And I should see "In place" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    Then I should see the "Menu" screen
    When I CLOSE the app
    When the Admin turns ON the "Take away" mode from "Késdobáló #111"
    And the Admin clicks on the "Regnerate menu" button
    When I am on the unit selector screen
    And I should see "Take away" icon on the "Késdobáló #111" unit card
    When I tap on the "Késdobáló #111" unit in the list
    Then I should see the "Menu" screen
    When I CLOSE the app

  Scenario: takeaway product modifier visible on cart screen
    When I tap on the "Sajtburger" button
    Then I should see "Válassz méretet" text
    When I tap on the "1 db double" button
    And I tap on the "Add to cart" button
    Then I should see the "Menu screen"
    When I tap on the "MY CART (2000 Ft)" button
    When I tap on the "PAY (2000 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And I should see the "Cart" screen
    When I tap on the "PAY (2000 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the option "Card, SZÉP card" button
    And I should see "PLACE ORDER" text

  Scenario: Create takeaway order
    Given I am on the login screen
    When I tap on the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "Take away" button
    Then I should see the "Menu" screen
    When I tap on the "Sajtburger" button
    And I tap on the "ADD TO CART" button
    And I tap on the "MY CART (1700 Ft)" button
    Then I should see the cart screen
    When I tap on the "PAY (1700 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And I should see the "Cart" screen
    When I tap on the "PAY (1700 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the option "Credit Card Payment" button
    Then I should see "Add new card" screen with a form
    When I fill out the input "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input "MM/YY" with "01/23" date
    And I fill out the "CVV" input with the "111"
    And I tap on the "SAVE CARD" button
    Then I should see the "PAY" screen
    When I tap on the "visa **** 4242" button
    And I tap on the "PLACE ORDER" button
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
    When I tap on the "Done" button
    Then I should see "Order mode" text with "Takeaway" text
