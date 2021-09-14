Feature: Cash and card payment

  Using the VAT form

  Background: Login to the App and select a Unit
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture

  Scenario: Pay successfully with cash or card
    # about the #1592 issue
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    And I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Credit card at register"
    Then the option "Credit card at register" is highlighted
    When I click the button next to "I want a VAT invoice"
    And I tap the "FILL INVOICE FORM" button
    Then I should see "Invoice info" page
    When I fill out the "Name/Company name" input with "E2E test Company"
    And I fill out the "Tax ID Number" input with "1234567890"
    Then the "Country" button should contain "Hungary"
    When I fill out the "Zip code" input with "1234"
    And I fill out the "City" input with "Nekeresd"
    And I fill out the "Street address" input with "Test street"
    And I fill out the "Invoice email" input with "testuser+test@anyupp.com"
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And the state of the order is "WAITING"
    When the admin set the state of order to "SUCCESS"
    Then in the app the order should be in "PLACED" state
    When the admin set the state of order to "PROCESSING"
    Then in the app the order should be in "PROCESSING" state
    When the admin set the state of order to "READY"
    Then in the app the order should be in "READY" state
    When the admin set the state of order to "SERVED"
    Then I should see the text "No active order placed yet"
    When I tap the "History" tab
    Then I should see the "SERVED" label on the paid order
    And I should see "Load more..." at the bottom of the list
    # next order, with VAT and set the language to HU, to get the notification messages
    When I tap the "Profile" menu
    And I tap the "Settings" tab
    And I tap the "Language" tab
    And I tap the "Hungarian" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap the "Étlap" icon from the bottom navigation bar
    And I tap the "FANTA #2" card under "Teszt termék kategória #1 név" category
    And I tap the "Kosárhoz adás" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    Then there is the "Kosár" screen
    And I should see the selected table and seat at the top right corner
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Pincérnél készpénzzel"
    Then the option "Pincérnél készpénzzel" is highlighted
    When I click the button next to "Áfás számlát kérek"
    And I tap the "SZÁMLAADATOK MEGADÁSA" button
    Then I should see "Számlázási adatok" page
    And I should see the form filled with the previous datas
    When I tap the "RENDELÉS" button
    Then I wait around 10 secs
    And the "Rendelések" option is selected on the bottom navigator
    And the banner on the "Rendelések" icon is "2"
    And the "Rendelések" page is selected on the top navigator
    And the state of the order is "VÁR"
    When the admin set the state of order to "SIKERES"
    Then in the app the order should be in "BEADVA" state
    When the admin set the state of order to "PROCESSING"
    Then I get the text message "Rendelésed már készítjük."
    And in the app the order should be in "KÉSZÜL" state
    When the admin set the state of order to "READY"
    Then I get the text message "Rendelésed elkészült. Felszolgálása folyamatban."
    When the admin set the state of order to "SERVED"
    Then I should see the text "Nincs teljesítésre váró rendelésed."
    When I tap the "Történet" tab
    Then I should see the "FELSZOLGÁLVA" label on the paid order
    And I should see "Még több betöltése..." at the bottom of the list

  Scenario: Failed payment with cash or card
    When I tap the "FANTA #2" card under "Test product category #1 name" category
    And I tap the "Add To Cart" button
    Then The shop cart icon banner should show "1"
    When I tap the cart icon
    When I tap the qr code icon
    And the qr code reader opens the camera
    And I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And there is the "Cart" screen
    When I tap the button with the arrow
    Then there is a bottom dialog
    When I tap the option "Credit card at register"
    Then the option "Credit card at register" is highlighted
    And I tap the "PLACE ORDER" button
    Then I wait around 10 secs
    And the "Orders" option is selected on the bottom navigator
    And the banner on the "Orders" icon is "1"
    And the "Orders" page is selected on the top navigator
    And the state of the order is "WAITING"
    When the admin set the state of order to "FAILED"
    And the admin confirms with "Payment mode change"
    When the admin set the order to "DELETE ORDER"
    Then I should see the text "No active order placed yet"
    When I tap the "History" tab
    Then I should see the "REJECTED" label on the unpaid order
    And I should see "Load more..." at the bottom of the list
