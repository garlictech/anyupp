Feature: QR code and serving mode change

  About the use cases

  Scenario: QR reading outside of the app
    Given I have my camera opened
    When I read the QR code with my camera
    And I tap the "Anyupp" button
    Then I should see the login screen
    When I tap on the "Sign in without register" button
    Then I should see "finding table and chair..." loading screen
    And I should see "Table: #01, Chair: #01" popup
    When I tap on the "OK" button
    Then I should see the "Please select" dialog
    When I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" product category
    And I tap the "Add to cart" button
    And I tap the "MY CART (1700)" button
    Then there is the "Cart" screen
    When I tap the back arrow
    Then there is the "Menu" screen
    When I close the app
    And I open the app
    Then there is the unit selector screen
    When I tap on the "Késdobáló #111" card
    And I tap on the "In place" button
    Then I should see the "Menu" screen
    And I should see the "MY CART (1700)" text

  Scenario: QR reading on the unit selector screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    Then there is the unit selector screen
    And I should see "Click & scan your table to order" text
    When I tap the "Click & scan your table to order" button
    And the app opens my camera
    Then I should see "Scan the QR code on the table to order" text
    When I read the QR code
    Then there is a "finding table and chair" loading screen
    And I should get the a text message "New Table Reserved!"
    Then I should see "Chair: #01, Table: #01" popup
    When I tap on the "OK" button
    Then I should see "Please select" dialog
    When I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    And I tap the "MY CART (1700)" button
    Then there is the "Cart" screen
    When I tap the back arrow button
    Then I should see the "Menu" screen
    When I close the app
    And I open the app
    And I select the "Késdobáló #111" in in place mode
    Then there is the "Menu" screen
    And I should see the "MY CART (1700 Ft)" text

  Scenario: QR reading from the menu screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    Then I should see a QR reader icon
    When I tap the QR reader icon
    Then I should see "AnyUpp Would Like to Access the Camera" text
    When I tap the "OK" button
    Then I should see the "Scan the QR codoe on the table to order." text
    When I read the QR code
    Then I should see "finding table and chair..." loading screen
    And I should see "Chair: #01, Table: #01" popup
    When I tap on the "OK" button
    Then I should see the "Menu" screen

  Scenario: QR reading on the pay screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add to cart" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (1200 Ft)" button
    Then I should see the "Cart" screen
    When I tap the "PAY (1200 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the "Cash" button
    And I tap on the "PALCE ORDER" button
    And the app opens my camera
    Then I should see the "Scan the QR code on your table to order." text
    When I read the QR code
    Then I should see the "finding table and chair..." loading screen
    And I get the text message "New Seat Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" text
    When I tap on the "OK" button
    Then I should see the "Orders" screen

  Scenario: Switch between serving modes
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the "Unit selector" screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    And I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    When I tap the back arrow
    Then there is the "Menu" screen
    When I tap the back arrow
    And I select the "Késdobáló #111" in in place mode
    Then I should see the "Are you sure you want to switch to in place order mode?" text
    When I tap the "Yes" button
    Then I should see the "Menu" screen
    And my cart sould be deleted

  Scenario: Serving mode change on the cart screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the "Unit selector" screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    And I tap the "MY CART (1200 Ft)" button
    Then there is the "Cart" screen
    When I tap on the "Mode selector" button
    Then I should see "Please select" dialog
    When I tap on the "In place" button
    Then I should see "Do you want to switch to in-place mode?" dialog
    When I tap on the "Yes" button
    Then I should see the "Menu" screen
    And my cart should be deleted
