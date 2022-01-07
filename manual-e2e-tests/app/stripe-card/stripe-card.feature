Feature: Stripe Card

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap on the "Continue anonymously" text
    Then there is a loading screen
    # Then I should see "Allow AnyUpp to access this device's location?" text
    # When I tap on the "While using the app" text
    # Android
    # Then I should see "Allow "AnyUpp" to use your location?" text
    # When I tap on the "Allow While Using App" text
    # iOS
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" option
    Then I should see the "Menu" screen
    When I tap on the "You can switch between ordering methods at any time." text
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Add and delete a new credit card
    When I tap on the "Profile" icon
    Then I should see "AnonymUser" text
    When I tap on the "Saved cards" option
    Then there is a loading screen
    And I should see the "New Card" screen
    When I fill out the input "Card number" with "4242 4242 4242 4242"
    And I fill out the input "Expiration Date" with "12/25"
    And I fill out the "CVC" input with the "111"
    And I tap on the "Add New Card" button
    Then there is a loading screen
    Then I should see "Card added successfully!" message
    When I discard the dialog
    Then I should see the "Saved Cards" screen
    And I should see the added Card with 4444
    When I tap on the "delete" button
    Then there is a dialog "Are you sure? This card will be deleted"
    When I tap on the "Delete" text
    Then there is a loading screen
    And I should see the "New Card" screen
    When I tap on the "Saved Cards" text
    Then I should see "You have no saved cards yet" text

  Scenario: Pay with a new card then pay with the saved card
    # from order details
    When I tap on the "Fishburger" card under "Hamburgers" category
    Then I should see "sea fish burger" text
    When I select the "Rice" modifier under the "Garnish"
    Then I should see "1 x 1700 Ft" text
    When I tap on the "plus" button
    And I should see "2 x 1700 Ft" text
    When I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (3400 Ft)" button
    Then I should see the "Cart" screen
    And I should see "in place" text
    And I should see "+ Rice" text
    When I tap on the "Delete cart" text
    Then I should see "Are you sure you want to delete your cart?" text
    When I tap on the "Cancel" text
    When I tap on the "PAY (3400 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    Then I should see "2 x 298 Ft" text
    When I tap on the "PAY (3400 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the option "Credit Card Payment"
    And I should see the "Add new card" screen
    When I fill out the input "card number" with "4242 4242 4242 4242"
    And I fill out the input "expiration Date" with "01/23" date
    And I fill out the "CVV" input with the "111"
    And I tap on the "SAVE CARD" button
    Then I should see the "PAY" screen
    When I tap on the "visa **** 4242" checkbox
    And I tap on the "PLACE ORDER" button
    And I get the text message "Payment success!"
    And the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see "in place" on the order card
    And I should see "3400 Ft" on the order card
    And I should see the date of the created order
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    And I should see "Total cost 3400 Ft" text
    When I scroll down to the bottom
    Then I should see "Order Num" with 6 numbers
    And I should see "In place" text
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Message from AnyUpp! Your order is being processed."
    And the "We are just making the ordered items." state is highlighted
    When I tap on the "DOWNLOAD RECEIPT" button
    Then I should see "Számlázz.hu" receipt
    And I should see "3400 HUF" text
    When I tap on the "Done" button
    And the admin set the state of order to "READY"
    Then I get the text messsage "Message from AnyUpp! Your order is ready!"
    And the "Your order is complete, we will serve / pick you up soon." state is checked
    And the "Your order is being served / can be received." state is higlighted
    When the admin set the state of order to "SERVED"
    Then the "Your order is being served / received." state is checked
    When I tap on the "back arrow" button
    Then I should see "Order history" text
    And I should see "Served" on the order card
    And I should see "No active order placed yet" text
    # Scenario: second order with saved card, from order list
    When I tap on the "DISCOVER MENU" button
    And I tap on the "Beers"
    And I tap on the "Dreher" card under "Beers" category
    When I select the "3 dl" option
    When I select the "Cold" modifier under the "Temperature"
    Then I should see "1 x 500 Ft" text
    And I tap on the "ADD TO CART" button
    Then I should see the "Menu" screen
    When I tap on the "MY CART (500 Ft)" button
    Then I should see the "Cart" screen
    And I should see "In place" text
    And I should see "+ Cold" text
    When I tap on the "PAY (500 Ft)" button
    Then I should see the "PAY" screen
    When I tap on the "visa **** 4242" checkbox
    When I tap on the "PLACE ORDER" button
    Then there is a loading screen
    And I get the text message "Payment success!"
    And the "Orders" option is higlighted
    And I should see "Current orders" text
    And I should see "in place" text
    And I should see "500 Ft" text
    And I should see the date of the created order
    When I tap on the order with "Processed"
    Then the "We have received your order" state is checked
    And the "Your order has been confirmed, everything is fine!" state is checked
    And I should see "Total cost 500 Ft" text
    When I tap on the "back arrow" button
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
    When I tap on the "Profile" button
    And I tap on the "Settings" tab
    And I tap on the "Language" tab
    And I tap on the "Magyar" tab
    And I tap on the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap on the "Étlap" button
    And I tap on the "Hamburgerek" category
    And I tap on the "Sajtburger" card under "Hamburgerek" category
    And I select the "Rizs" modifier under the "Köret"
    Then I should see "1 x 1700 Ft" text
    When I tap on the "plus" button
    Then I should see "2 x 1700 Ft" text
    When I tap on the "KOSÁRHOZ ADÁS" button
    Then I should see the "Étlap" screen
    When I tap on the "KOSARAM (3400 Ft)" button
    Then I should see the "Kosár" screen
    When I tap on the "FIZETEK (3400 Ft)"
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    And I should see the "Kosár" screen
    When I tap on the "FIZETEK (3400 Ft)"
    And I should see the "FIZETÉSI MÓD" screen
    When I tap on the "visa **** 4242" checkbox
    When I click the button next to "I want a VAT invoice"
    Then I should see "Invoice Info" dialog
    When I fill out the "Név/Cég név" input with "E2E test Company"
    And I fill out the "Adószám" input with "1234567890"
    Then the "Ország" field should contain "Magyarország"
    When I fill out the "Irányítószám" input with "1234"
    And I fill out the "Város" input with "Nekeresd"
    And I fill out the "Utca cím" input with "Test street"
    And I fill out the "Számla email" input with "testuser+test@anyupp.com"
    And I tap on the "MENTÉS" button
    Then I should see the "FIZETÉSI MÓD" screen
    And I tap on the "MEGRENDELÉS" button
    Then there is a loading screen
    And I should get the "Sikeres fizetés!" message
    And the "Rendelések" option is higlighted
    Then I should see "Folyamatban lévő rendelések" text
    And I should see "helyben" on the order card
    And I should see "3400 Ft" on the order card
    And I should see the date/time of the created order
    When I tap on the order with "Feldolgozva"
    And the "A rendelésedet megkaptuk." state is checked
    And the "Rendelésed megerősítésre került, minden rendben!" state is checked
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed már készítjük."
    And the "Éppen készítjük a megrendelt tételeket." state is highlighted
    And I tap on the "SZÁMLA LETÖLTÉSE" button
    When I tap on the "Megnézem" button
    Then I should see "Számlázz.hu" receipt
    And I should see "3400 HUF" text
    When I tap on the "back arrow" button
    And the admin set the state of order to "READY"
    Then I get the text message "Üzenet az AnyUpp-tól! Rendelésed elkészült."
    Then the "Rendelésed elkészült, hamarosan felszolgáljuk neked/átveheted." state is checked
    Then the "Rendelésed felszolgálás alatt van/átvehető." state is highlighted
    When the admin set the state of order to "SERVED"
    Then the "Rendelésed felszolgálásra/átvételre került." state is checked
    When I tap on the "back arrow" button
    Then I should see "Korábbi rendelések" text
    And I should see "Felszolgálva" on the order card
    When I tap on the "Profil" icon
    And I tap on the "Tranzakciók" option
    And I should see the latest order
    And I tap on the "Megtekintés" text
    Then I should see "3400 HUF" text
    When I tap on the "Megnézem" text
    Then I should see "3400 HUF" text
    Then I should see "Számlázz.hu" receipt
    When I tap on the back arrow
    Then I should be on the "Tranzakciók" list
