Feature: Cash and card payment

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap on the "Continue anonymously" text
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" button
    Then I should see the "Menu" screen
    When I tap on the "You can switch between ordering methods at any time." text
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Pay successfully with cash or card
    #This is a 2 in 1 scenario.
    When I tap on the "Fishburger" card under "Hamburgers" category
    Then I should see "sea fish burger" text
    When I select the "1 db double" option
    And I select the "Rice" modifier under the "Garnish"
    Then I should see "1 x 2000 Ft" text
    When I tap on the "plus" button
    Then I should see "2 x 2000 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (4000 Ft)" button
    Then I should see the "Cart" screen
    And I should see "in place" text
    And I should see "+ Rice" text
    When I tap on the "plus" button
    Then I should see "3 x 2000 Ft" text
    And I should see "PAY (6000 Ft)" text
    When I tap on the "minus" button
    Then I should see "2 x 2000 Ft" text
    When I tap on the "PAY (4000 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Card, SZÉP card"
    And I tap the button next to "I want a VAT invoice"
    Then I should see "Invoice Info" dialog
    When I fill out the "Name/Company name" input with "E2E test Company"
    And I fill out the "Tax ID Number" input with "1234567890"
    Then the "Country" field should contain "Magyarország"
    When I fill out the "Zip code" input with "1234"
    And I fill out the "City" input with "Nekeresd"
    And I fill out the "Street address" input with "Test street"
    And I fill out the "Invoice email" input with "testuser+test@anyupp.com"
    And I tap on the "SAVE" button
    Then I should see VAT "E2E test Company, 1234, Nekeresd, Test" is checked
    When I tap on the "PLACE ORDER" button
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
    And I should see "4000 Ft" on the order card
    And I should see a three digit order number
    When I tap on the order with "Processing"
    Then I should see "Order status" text
    And the "We have received your order." state is checked
    And I should see the "Order details" text
    And I should see the "Fishburger double + Rice" text
    And I should see "Total cost 4000 Ft" text
    And I should see "Payment details" text
    And I should see "Card payment at the waiter." text
    And I should see "More details" text
    And I should see "Order num" with 3 numbers
    And I should see "Késdobáló #111" text
    And the admin set the state of order to "SUCCESS"
    And the "Your order has been confirmed, everything is fine!" state is checked
    When the admin set the state of order to "PROCESSING"
    Then I should see the popup with "We are placing your order" text and a 3 digit order number
    When I tap on the "OK" button
    And the "We're preparing your order." state is highlighted
    When the admin set the state of order to "READY"
    Then I should see the popup with "Your order is served" text and a 3 digit order number
    When I tap on the "OK" button
    Then I should see the "Your order is commplete, we will serve it/you can pick is up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then I should see "Order served" text
    When I tap on the "back arrow" button
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    And I should see "Served" on the order card
    # Scenario: next order, with VAT and in HU, from order list
    When I tap on the "Profile" button
    And I tap on the "Language" tab
    And I tap on the "Hungarian" tab
    And I tap on the "SET LANGUAGE" button
    Then I should see the app in HU language
    When I tap on the "Étlap" button
    And I tap on the "Sajtburger" card under "Hamburgerek" category
    And I select the "Főtt krumpli" modifier under the "Köret"
    Then I should see "1 x 1700 Ft" text
    When I tap on the "KOSÁRHOZ ADÁS" button
    Then I should see the "Étlap" screen
    When I tap on the "KOSARAM (1700 Ft)" button
    Then I should see the "Kosár" screen
    When I tap on the "FIZETEK (1700 Ft)" button
    Then I should see the "FIZETÉSI MÓDOK" screen
    When I tap on the option "Készpénz"
    And I tap on the checkbox under "ÁFÁ-S SZÁMLA"
    And I tap on the "MEGRENDELEM" button
    Then I should see a loading screen
    And I should see "Sikeres rendelés!" popup
    When I tap on the "RENDBEN" button
    Then I should see the "Rendelések" screen
    And I should see "Folyamatban lévő rendelések" text
    And I should see "1700 Ft" on the order card
    And I should see "helyben" on the order card
    And I should see a 3 digit order number
    When I tap on the order with "Feldolgozás alatt"
    Then the "A rendelésedet megkaptuk." state is checked
    And I should see "ÖSSZESEN 1700 Ft" text
    When I tap on the "back arrow" button
    And the admin set the state of order to "SUCCESS"
    Then I should see "Feldolgozva" on the order card
    When the admin set the state of order to "PROCESSING"
    Then I should see "#001 Készítjük a rendelésed" popup
    When I tap on the "RENDBEN" button
    And I should see "Készül a rendelésed" on the order card
    When the admin set the state of order to "READY"
    Then I should see "#001 Elékszült a rendelésed" popup
    When I tap on the "RENDBEN" button
    And I should see "Elkészült" on the order card
    When the admin set the state of order to "SERVED"
    Then I should see "Korábbi rendelések" text
    When I tap on the order with "#001"
    Then the "Rendelésed teljesítve" state is checked

  Scenario: Failed/deleted payment with cash or card
    When I tap on the "Non-alcoholic drinks" category
    And I tap on the "Coca-Cola" card
    And I tap on the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap on the "MY CART (300 Ft)" button
    Then I should see the "Cart" screen
    When I tap on the "PAY (300 Ft)" button
    Then I should see the "PAYMENT" screen
    When I tap on the option "Card, SZÉP card" button
    And I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "finding table and chair ..." loading screen
    And I get the notification message "New Table Reserved!"
    And I should see "Chair: #01, Table: #01" text
    When I tap on the "OK" button
    Then I should see "Successful order!" popup
    When I tap on the "OK" button
    Then the "Orders" option is higlighted
    And I should see the 3 digit order ID of the created order
    When I tap on the order with "Processing"
    Then the "We have received your order." state is checked
    And I should see "Total cost 300 Ft" text
    When the admin set the state of order to "FAILED"
    And the admin confirms with "Payment mode change"
    And the admin set the order to "DELETE ORDER"
    Then I should see "Order deleted" text
    When I tap on the "back arrow" button
    Then I should see "Order history" text
    And I should see "Deleted" on the order card
