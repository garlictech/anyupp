Feature: QR code and serving mode change

  About the use cases

  Scenario: QR reading outside of the app
    Given I have my camera opened
    When I read the QR code with my camera
    And I tap the "Anyupp" button
    Then I should see a loading screen
    And I should see the "Please select" dialog
    When I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" product category
    And I tap the "Add to cart" button
    And I tap the "MY CART (1700)" button
    Then there is the "Cart" screen
    When I tap the "close" button
    Then there is the "Menu" screen
    When I close the app
    And I open the app
    Then there is the "Menu" screen
    And I should see the "MY CART (1700)" text

  Scenario: QR reading on the unit selector screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    Then there is the "Unit selector" screen
    And I should see "Click & scan your table to order" text
    When I tap the "Click & scan your table to order" button
    And the app opens my camera
    Then I should see "Scan the QR code on your table to finalize your order" text
    When I read the QR code
    Then there is a loading screen
    And I should get the a text message "New Table Reserved!"
    And I should see "Please select" dialog
    When I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    And I tap the "Add To Cart" button
    And I tap the "MY CART (1700)" button
    Then there is the "Cart" screen
    When I tap the "close" button
    Then I should see the "Menu" screen
    When I close the app
    And I open the app
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
    Then I should see the "Scan the QR codoe on your table to finalize your order." text
    When I read the QR code
    Then I should see "Finding your seat..." text
    Then I should see the "Menu" screen
  #nincs már ilyen opció?!

  Scenario: QR reading on the cart screen
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" category
    Then I should see "Add to cart" text
    When I tap the "Add to cart" button
    Then I should see the "Menu" screen
    And I should see "MY CART (1700 Ft)" text
    When I tap on the "MY CART (1700 Ft)" button
    Then I should see the "Cart" screen
    When I tap the "Pay (1700 Ft)" button
    Then I should see the "PAY" screen
    And the app opens my camera
    Then I should see the "Scan the QR codoe on your table to finalize your order." text
    When I read the QR code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"

  Scenario: Starting app
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
    When I tap the "close" button
    Then there is the "Menu" screen
    When I close the app
    And I open the app
    Then there is the "Unit selector" screen
    When I tap on the "Késdobáló #111" card
    Then I should see the "Menu" screen
    And I should see the "MY CART (1700 Ft)" text
    When I tap the Take away icon
    Then I should see the "Please select" text
    And I should see "In place" text
    When I tap the "In place" button
    Then I should see the "Are you sure you want to switch to in place order mode?" text
    When I tap the "Yes" button
    Then my cart sould be deleted

  Scenario: End of payment method
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the "Unit selector" screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "Sajtburger" card under "Hamburgers" product category
    And I tap the "Add To Cart" button
    And I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    When I tap the "Pay (1700 Ft)" button
    Then there is the "PAY" screen
    When I tap the "Cash" button
    And I tap the "Place order" button
    And the app opens my camera
    Then I should see the "Scan the QR codoe on your table to finalize your order." text
    When I read the QR code
    Then I should see the "Finding your seat..." loading screen
    And I get the text message "New Table Reserved!"
    And I should see "Successful order!" text
    When I tap on the "ALL RIGHT" button
    Then I should see "Current orders" text
    And my cart should be empty

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
    And I tap the "MY CART (1700 Ft)" button
    Then there is the "Cart" screen
    When I tap on the "Mode selector" button
    Then I should see "Please select" dialog
    When I tap on the "Take away" button
    Then I should see "Are you sure you want to switch to take away order mode?" dialog
    When I tap on the "Yes" button
    Then I should see the "Menu" screen
    And my cart should be deleted
