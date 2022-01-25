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
    # from order details
    And I tap on the "Fishburger" card under "Hamburgers" category
    Then I should see "sea fish burger" text
    When I select the "1 db double" option
    When I select the "Rice" modifier under the "Garnish"
    Then I should see "1 x 2000 Ft" text
    When I tap on the "plus" button
    And I should see "2 x 2000 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" is selected
    When I tap on the "MY CART (2000 Ft)" button
    Then I should see the "Cart" screen
    And I should see "in place" text
    And I should see "+ Rice" text
    When I tap on the "plus" button
    Then I should see "3 x 2000 Ft" text
    And I should see "PAY (6000 Ft)" text
    When I tap on the "minus" button
    Then I should see "2 x 2000 Ft" text
    When I tap on the "PAY (4000 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the option "Card, SZÉP card"
    When I click the button next to "I want a VAT invoice"
    Then I should see "Invoice Info" dialog
    When I fill out the "Name/Company name" input with "E2E test Company"
    And I fill out the "Tax ID Number" input with "1234567890"
    Then the "Country" field should contain "Magyarország"
    When I fill out the "Zip code" input with "1234"
    And I fill out the "City" input with "Nekeresd"
    And I fill out the "Street address" input with "Test street"
    And I fill out the "Invoice email" input with "testuser+test@anyupp.com"
    And I tap on the "SAVE" button
    Then I should see the "PAY" screen
    And I should see VAT "E2E test Company, 1234, Nekeresd, Test" is checked
    When I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." loading screen
    And I get the text message "New Table Reserved!"
    And I should see "Succesful order!" text
    When I tap on the "ALL RIGHT" button
    Then I should see the "Orders" screen
    And I should see "Current orders" text
    And I should see "in place" on the order card
    And I should see "4000 Ft" on the order card
    And I should see the date/time of the created order
    When I tap on the order with "Processing"
    Then I should see "Order status" text
    And the "We have received your order" state is checked
    And I should see the "Order details" text
    And I should see the "Fishburger double + Rice" text
    And I should see "Total cost 4000 Ft" text
    And I should see "More details" text
    And I should see "Order num" with 6 numbers
    And I should see "Késdobáló #111" text
    And the admin set the state of order to "SUCCESS"
    And the "Your order has been confirmed, everything is fine!" state is checked
    And the admin set the state of order to "PROCESSING"
    Then I get the text message "Message from AnyUpp! Your order is being processed."
    And the "We are just making the ordered items." state is highlighted
    And the admin set the state of order to "READY"
    Then I get the text message "Message from AnyUpp! Your order is ready!"
    And the "Your order is complete, we will serve / pick you up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then the "Your order has been served / received." state is checked
    When I tap on the "back arrow" button
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    And I should see "Served" on the order card
    # Scenario: next order, with VAT and in HU, from order list
    When I tap on the "Profile" button
    And I tap on the "Language" tab
    And I tap on the "Magyar" tab
    And I tap on the "SET LANGUAGE" button
    Then I should see the app in HU language
    When I tap on the "Étlap" button
    And I tap on the "Sajtburger" card under "Hamburgerek" category
    And I select the "Rizs" modifier under the "Köret"
    Then I should see "1 x 1700 Ft" text
    When I tap on the "KOSÁRHOZ ADÁS" button
    Then I should see the "Étlap" screen
    When I tap on the "KOSARAM (1700 Ft)" button
    Then I should see the "Kosár" screen
    When I tap on the "FIZETEK (1700 Ft)" button
    Then I should see the "FIZETÉSI MÓDOK" screen
    When I tap on the option "Készpénz"
    And I tap on the VAT inform under "ÁFÁ-S SZÁMLA"
    Then I should see "Számlázási adatok" page
    And I should see the form filled with the previous datas
    When I tap on the "MENTÉS" button
    And I tap on the checkbox under "ÁFÁ-S SZÁMLA"
    And I tap on the "MEGRENDELÉS" button
    Then I should see a loading screen
    And I should see "Sikeres rendelés!" text
    When I tap on the "RENDBEN" button
    And the "Rendelések" option is higlighted
    Then I should see "Folyamatban lévő rendelések" text
    And I should see "1700 Ft" on the order card
    And I should see "elvitel" on the order card
    And I should see the date/time of the created order
    When I tap on the order with "Feldolgozás alatt"
    And the "A rendelésedet megkaptuk." state is checked
    And I should see "ÖSSZESEN 1700 Ft" text
    When I tap on the "back arrow" button
    And the admin set the state of order to "SUCCESS"
    Then I should see "Feldolgozva" on the order card
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed már készítjük."
    And I should see "Készül a rendelésed" on the order card
    When the admin set the state of order to "READY"
    Then I get the text message "Üzenet az AnyUpp-tól! Felszolgálása folyamatban."
    And I should see "Elkészült" on the order card
    When the admin set the state of order to "SERVED"
    Then I should see "Korábbi rendelések" text
    When I tap on the order with "Felszolgálva"
    Then the "Rendelésed felszolgálásra/átvételre került." state is checked

  Scenario: Failed payment with cash or card
    When I tap on the "Non-alcoholic drinks" category
    And I tap on the "Coca-Cola" card
    And I tap on the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap on the "MY CART (300 Ft)" button
    Then I should see the "Cart" screen
    When I tap on the "PAY (300 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the option "Card, SZÉP card" button
    And I tap on the "PLACE ORDER" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." loading screen
    And I get the text message "New Table Reserved!"
    And I should see "Successful order!" text
    When I tap on the "ALL RIGHT" button
    Then the "Orders" option is higlighted
    And I should see the date of the created order
    When I tap on the order with "Processing"
    Then the "We have received your order." state is checked
    And I should see "Total cost 300 Ft" text
    When I scroll down to the bottom
    Then I should see "Order Num" with 6 numbers
    When the admin set the state of order to "FAILED"
    And the admin confirms with "Payment mode change"
    And the admin set the order to "DELETE ORDER"
    When I tap on the "back arrow" button
    Then I should see "Order history" text
    When I tap on the order with "Deleted"
    Then I should see "Your order has been rejected. Please check with the restaurant staff." text
