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

  Scenario: Pay successfully with cash or card
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
    When the admin set it to "SUCCESS" payment
    Then I should see the order in "PLACED"
    When the admin set it to "PROCESSING"
    And the admin set it to "READY"
    And the admin set it to served
    Then I should see the text "No active order placed yet"
    When I swipe to the "History" tab
    Then I should see the "SERVED" label on the paid order
    And I should see "Load more..." at the bottom of the ordoers
    # next order, with VAT and set the language to HU, to get the notification messages
    When I tap the "Profile" menu
    And I tap the "Settings" tab
    And I tap the "Language" tab
    And I tap the "Hungarian" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap the "Étlap" icon from the bottom navigation bar
    When I tap the "FANTA #2" card under "Teszt termék kategória #1 név" category
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
    And I tap the "RENDELÉS" button
    Then I wait around 10 secs
    And the "Rendelések" option is selected on the bottom navigator
    And the banner on the "Rendelések" icon is "2"
    And the "Rendelések" page is selected on the top navigator
    And the state of the order is "VÁR"
    When the admin set it to "SIKERES" payment
    Then I should see the order in "BEADVA"
    When the admin set it to "KÉSZÜL"
    Then I get the text message "Rendelésed már készítjük."
    When the admin set it to "KÉSZ"
    Then I get the text message "Rendelésed elkészült. Felszolgálása folyamatban."
    And the admin set it to served
    Then I should see the text "Nincs teljesítésre váró rendelésed."
    When I swipe to the "Történet" tab
    Then I should see the "FELSZOLGÁLVA" label on the paid order
    And I should see "Még több betöltése..." at the bottom of the ordoers

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
    When the admin set it to "FAILED" payment
    And the admin confirms with "Payment mode change"
    And the admin delete the order with the button
    Then I should not see my order on the "Orders" tab
    When I tap the "History" tab
    Then I should see the "REJECTED" label on the unpaid order
    And I should see "Load more..." at the bottom of the ordoers
