Feature: Stripe Card

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    # Then I should see "Allow AnyUpp to access this device's location?" text
    # When I tap the "While using the app" text
    # Android
    # Then I should see "Allow "AnyUpp" to use your location?" text
    # When I tap the "Allow While Using App" text
    # iOS
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text

  Scenario: Add and delete a new credit card
    When I tap the "Profile" icon
    Then there is the "Profile" screen
    When I tap the "Saved cards" option
    Then there is a loading screen
    And there is the "New Card" screen
    When I fill out the input with id "Card number" with "4242 4242 4242 4242"
    And I fill out the input with id "Expiration Date" with todays date
    And I fill out the "CVC" input with the "111"
    And I tap the "Add New Card" button
    Then there is a loading screen
    Then I should see "Card added successfully!" message
    When I discard the dialog
    Then there is the "Saved Cards" screen
    And I should see the added Card
    When I tap the "delete" button
    Then there is a dialog "Are you sure? This card will be deleted"
    When I tap the "Delete" text
    Then there is a loading screen
    And there is the "New Card" screen
    When I tap the "Saved Cards" text
    Then I should see "No cards saved yet" text

  Scenario: Pay with a new card then pay with the saved card
    # from order details
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    Then I should see "Fanta #2 description" text
    When I select the "CLASSIC" modifier under the "Extra comp set"
    Then I should see "1 x 298 Ft" text
    When I tap the "plus" button
    Then I should see "2 x 298 Ft" text
    When I tap the "ADD TO CART" button
    Then there is the "Menu" screen
    When I tap the "MY CART (596 Ft)" button
    Then there is the "Cart" screen
    And I should see "takeaway" text
    And I should see "CLASSIC" text
    When I tap the "Delete cart" button
    Then I should see "Are you sure you want to delete your cart?" text
    When I tap the "Cancel" button
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
    And I should see "596 HUF" text
    When I tap the "Done" button
    And the admin set the state of order to "READY"
    Then I get the text messsage "Message from AnyUpp! Your order is ready!"
    And the "Your order is complete, we will serve / pick you up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then the "Your order is being served / received." state is checked
    When I tap the "back arrow" button
    Then I should see "Order history" text
    And I should see "Served" on the order card
    And I should see "No active order placed yet" text
    # Scenario: second order with saved card, from order list
    When I tap the "DISCOVER MENU" button
    And I tap the "FANTA #2" card under "Test product category #1 name" category
    When I select the "CLASSIC" modifier under the "Modifier comp set"
    Then I should see "1 x 298 Ft" text
    And I tap the "ADD TO CART" button
    Then there is the "Menu" screen
    When I tap the "MY CART (298 Ft)" button
    Then there is the "Cart" screen
    And I should see "FRENCH FRIES" text
    When I tap the "PAY (298 Ft)" button
    Then there is a payment dialog with "Please select a payment method" text
    When I the the option "Pay by Card via Stripe (preferred)"
    When I tap the "PLACE ORDER" button
    Then there is a loading screen
    And there is the "Saved Cards" screen
    And I should see the higlighted card with the number "4242"
    When I tap the "Delete" button
    Then I should see "Are you sure? This card will be deleted" text
    When I tap the button "Cancel"
    And I tap the button "Pay with Stripe"
    Then there is a loading screen
    And I get the text message "Payment success!"
    And the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see the date of the created order
    And I should see "takeaway" text
    And I should see "298 Ft" text
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    And I should see "Total cost 298 Ft" text
    When I tap the "back arrow" button
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Message from AnyUpp! Your order is being processed."
    And I should see "Your order is being processed" on the order card
    And the admin set the state of order to "READY"
    Then I get the text messsage "Message from AnyUpp! Your order is ready!"
    And I should see "Done" on the order card
    When the admin set the state of order to "SERVED"
    Then I should see "No active order placed yet" text
    And I should see "Order history" text
    When I tap on the order with "Served"
    Then the "Your order has been served / received." state is checked

  Scenario: Pay without saving the card with VAT and in HU lang
    When I tap the "Profile" button
    And I tap the "Settings" tab
    And I tap the "Language" tab
    And I tap the "Magyar" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap the "Étlap" button
    And I tap the "Hamburger #1" card under "Teszt termék kategória #1 név" category
    And I select the "HASÁBBURGONYA" modifier under the "Módosító komponens set"
    Then I should see "1 x 148 Ft" text
    When I tap the "plus" button
    Then I should see "2 x 148 Ft" text
    When I tap the "KOSÁRHOZ ADÁS" button
    Then there is the "Étlap" screen
    When I tap the "KOSARAM (296 Ft)" button
    Then there is the "Kosár" screen
    When I tap the "FIZETEK (296 Ft)"
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And there is the "Kosár" screen
    When I tap the "FIZETEK (296 Ft)"
    Then there is a payment dialog with "Melyik fizetési módot választod?" text
    When I tap the option "Kártyás fizetés Stripe-pal (ajánlott)"
    When I click the button next to "Áfás számlát kérek"
    And I tap the "SZÁMLAADATOK MEGADÁSA" button
    Then I should see "Számlázási adatok" page
    When I fill out the "Név/Cég név" input with "E2E test Company"
    And I fill out the "Adószám" input with "1234567890"
    Then the "Ország" button should contain "Magyarország"
    When I fill out the "Irányítószám" input with "1234"
    And I fill out the "Város" input with "Nekeresd"
    And I fill out the "Utca cím" input with "Test street"
    And I fill out the "Számla email" input with "testuser+test@anyupp.com"
    And I tap the "RENDELÉS" button
    Then there is a loading screen
    When I fill out the input with id "Kártya szám" with "5555 5555 5555 4444"
    And I fill out the input with id "Lejárati dátum" with "11/22" date
    And I fill out the "CVC kód" input with the "123"
    When I tap the button "Fizetés Stripe-pal"
    Then there is a loading screen
    And I should get the "Sikeres fizetés!" message
    And the "Rendelések" option is higlighted
    Then I should see "Folyamatban lévő rendelések" text
    And I should see the date/time of the created order
    And I should see "296 Ft" on the order card
    And I should see "elvitel" on the order card
    When I tap on the order with "Feldolgozva"
    And the "A rendelésedet megkaptuk." state is checked
    And the "Rendelésed megerősítésre került, minden rendben!" state is checked
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed már készítjük."
    And the "Éppen készítjük a megrendelt tételeket." state is highlighted
    When I scroll down to the bottom
    And I tap the "SZÁMLA LETÖLTÉSE" button
    When I tap the "Megnézem" button
    Then I should see "Számlázz.hu" receipt
    And I should see "296 HUF" text
    When I tap the "back arrow" button
    And the admin set the state of order to "READY"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed elkészült."
    Then the "Rendelésed elkészült, hamarosan felszolgáljuk neked/átveheted." state is checked
    Then the "Rendelésed felszolgálás alatt van/átvehető." state is highlighted
    When the admin set the state of order to "SERVED"
    Then the "Rendelésed felszolgálásra/átvételre került." state is checked
    When I tap the "back arrow" button
    Then I should see "Korábbi rendelések" text
    And I should see "Felszolgálva" on the order card
    When I tap the "Profil" icon
    And I tap the "Tranzakciók" option
    And I should see the latest order
    And I tap the "Megtekintés" text
    Then I should see "296 HUF" text
    When I tap the "Megnézem" text
    Then I should see "296 HUF" text
    Then I should see "Számlázz.hu" receipt
    When I tap the back arrow
    Then I should be on the "Tranzakciók" list
