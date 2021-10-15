Feature: Cash and card payment

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture

  Scenario: Pay successfully with cash or card
    This is a 2 in 1 scenario. Text updates appear only in the first scenario.
    When I tap the "Bármikor válthatsz a rendelési módok között." text
    And I tap the "FANTA #2" card under "Test product category #1 name" category
    Then I should see "Fanta #2 description" text
    When I select the "FRENCH FRIES" modifier under the "Modifier comp set"
    Then I should see "1 x 298 Ft" text
    When I tap the "plus" button
    And I should see "2 x 298 Ft" text
    When I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (596 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (595 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    And I should see the selected table and seat on the top
    And I should see "FRENCH FRIES" text
    Then I should see "2 x 298 Ft" text
    When I tap the "plus" button
    Then I should see "3 x 298 Ft" text
    And I should see "PAY (895 Ft)" text
    When I tap the "minus" button
    Then I should see "2 x 298 Ft" text
    And I should see "PAY (596 Ft)" text
    When I tap the "PAY (595 Ft)" button
    Then there is a payment dialog
    When I tap the option "Credit card at my table to my server + SZÉP card"
    Then the option "Credit card at my table to my server + SZÉP card" is highlighted
    And I should see "PLACE ORDER" text
    When I click the button next to "I want a VAT invoice"
    And I tap the "FILL INVOICE FORM" button
    Then I should see "Invoice info" text on the dialog
    When I fill out the "Name/Company name" input with "E2E test Company"
    And I fill out the "Tax ID Number" input with "1234567890"
    Then the "Country" field should contain "Magyarország"
    When I fill out the "Zip code" input with "1234"
    And I fill out the "City" input with "Nekeresd"
    And I fill out the "Street address" input with "Test street"
    And I fill out the "Invoice email" input with "testuser+test@anyupp.com"
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    And there is the "Cart" screen
    And I should see "Your cart is empty" text
    When I tap the "close" button
    And the "Orders" option is higlighted
    Then I should see "Current orders" text
    And I should see the date/time of the created order
    When I tap on the order with "596 Ft"
    Then I should see "Order status" text
    And the "We have received your order" state is checked
    And I should see the "Order details" text
    And I should see the "FRENCH FRIES" text
    And I should see "Total cost 596 Ft" text
    When I scroll down to the bottom
    And I should see "Order Num" with 6 numbers
    And I should see "More details" text
    And I should see "Késdobáló #111" text
    When I tap the "back arrow" button
    And the admin set the state of order to "SUCCESS"
    When I tap on the order with "Processed"
    And the "Your order has been confirmed, everything is fine!" state is checked
    When I tap the "back arrow" button
    And the admin set the state of order to "PROCESSING"
    Then I get the text message "Message from AnyUpp! Your order is being processed."
    When I tap on the order with "Processing"
    And the "We are just making the ordered items." state is checked
    When I tap the "back arrow" button
    And the admin set the state of order to "READY"
    Then I get the text message "Message from AnyUpp! Your order is ready!"
    When I tap on the order with "Done"
    And the "Your order is being served / can be received." state is checked
    When I tap the "back arrow" button
    When the admin set the state of order to "SERVED"
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    And I should see "Served" text
    # Scenario: next order, with VAT and set the language to HU
    When I tap the "Profile" button
    And I tap the "Settings" tab
    And I tap the "Language" tab
    And I tap the "Hungarian" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap the "Étlap" button
    And I tap the "FANTA #2" card under "Teszt termék kategória #1 név" category
    And I select the "FRENCH FRIES" modifier under the "Módosító komponens set"
    Then I should see "1 x 298 Ft" text
    When I tap the "KOSÁRHOZ ADÁS" button
    Then there is the "Étlap" screen
    When I tap the "KOSARAM (298 Ft)" button
    Then there is the "Kosár" screen
    And I should see the selected table and seat on the top
    When I tap the "FIZETEK (298 Ft)"
    Then there is a payment dialog
    When I tap the option "Pincérnél készpénzzel"
    Then the option "Pincérnél készpénzzel" is highlighted
    When I click the button next to "Áfás számlát kérek"
    And I tap the "SZÁMLAADATOK MEGADÁSA" button
    Then I should see "Számlázási adatok" page
    And I should see the form filled with the previous datas
    When I tap the "RENDELÉS" button
    Then I wait around 10 secs
    And there is the "Kosár" screen
    And I should see "A kosarad még üres." text
    When I tap the "close" button
    And the "Rendelések" option is higlighted
    Then I should see "Folyamatban lévő rendelések" text
    And I should see the date/time of the created order
    And I should see "Feldolgozás alatt" text
    When I tap on the order with "298 Ft"
    And the "A rendelésedet megkaptuk." state is checked
    And I should see "ÖSSZESEN 298 Ft" text
    When I scroll down to the bottom
    Then I should see "Rendelés szám" with 6 numbers
    When I tap the "back arrow" button
    And the admin set the state of order to "SUCCESS"
    When I tap on the order with "Feldolgozva"
    And the "Rendelésed megerősítésre került, minden rendben!" state is checked
    When I tap the "back arrow" button
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed már készítjük."
    When I tap on the order with "Készül a rendelésed"
    And the "Éppen készítjük a megrendelt tételeket." state is highlighted
    When I tap the "back arrow" button
    When the admin set the state of order to "READY"
    Then I get the text message "Message from AnyUpp! Your order is ready!"
    When I tap on the order with "Elkészült"
    Then the "Rendelésed elkészült, hamarosan felszolgáljuk neked/átveheted." state is checked
    Then the "Rendelésed felszolgálás alatt van/átvehető." state is highlighted
    When I tap the "back arrow" button
    When the admin set the state of order to "SERVED"
    Then I should see "Korábbi rendelések" text
    When I tap on the order with "Felszolgálva"
    Then the "Rendelésed felszolgálásra/átvételre került." state is checked

  Scenario: Failed payment with cash or card
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then I should see the "Menu" is selected
    When I tap the "MY CART (298 Ft)" button
    Then there is the "Cart" screen
    When I tap the "PAY (298 Ft)" button
    Then the qr code reader opens the camera
    When I tap the qr code icon
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Cart" screen
    And I should see the selected table and seat on the top
    When I tap the "PAY (596 Ft)" button
    Then there is a payment dialog
    When I tap the option "Credit card at my table to my server + SZÉP card"
    Then the option "Credit card at my table to my server + SZÉP card" is highlighted
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    Then there is the "Cart" screen
    And I should see "Your cart is empty" text
    When I tap the "close" button
    And the "Orders" option is higlighted
    And I should see the date of the created order
    When I tap on the order with "Processing"
    Then the "We have received your order." state is checked
    And I should see "Total cost 298 Ft" text
    When I scroll down to the bottom
    Then I should see "Order Num" with 6 numbers
    When the admin set the state of order to "FAILED"
    And the admin confirms with "Payment mode change"
    And the admin set the order to "DELETE ORDER"
    When I tap the "back arrow" button
    Then I should see "Order history" text
    When I tap on the order with "Deleted"
    Then I should see "Your order has been rejected. Please check wirh the restaurant staff." text
