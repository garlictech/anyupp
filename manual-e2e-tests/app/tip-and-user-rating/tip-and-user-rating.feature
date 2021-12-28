Feature: Tip and user rating

Feature: Tipping and order rating

  Background: I have a completed stripe order
    Given the language is set to HU
    And I am on the "Étlap" screen
    When I tap the "Sajtburger" card under "Hamburgerek" category
    Then I should see "Sajtburger sajtps szendvics" text
    When I tap the "KOSÁRHOZ ADÁS" button
    Then there is the "Étlap" screen
    When I tap the "KOSARAM (1700 Ft)" button
    Then there is the "Cart" screen
    And I tap the "FIZETEK (1700 Ft)" button
    Then the qr code reader opens the camera
    When I read a seat qr code
    Then I should see the "Finding your seat..." and the "Connected to" loading screens
    And I get the text message "New Table Reserved!"
    When I tap the "FIZETEK (596 Ft)" button
    Then there is the "FIZETÉSI MÓD" screen
    When I tap the option "Bankkártyás fizetés"
    And there is "Új kártya hozzáadása" screen with a form
    When I fill out the input with id "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input with id "HH/ÉÉ" with "01/23" date
    And I fill out the "CVV kód" input with the "111"
    And I tap the "KÁRTYA MENTÉSE" button
    Then there is a loading screen
    When I tap on the "visa **** 4242" option
    And I tap on the "MEGRENDELÉS" button
    And I get the text message "Sikeres fizetés!"
    And the "Rendelések" option is higlighted
    And I should see "Folyamatban lévő rendelések" text
    When I tap on the order with "Feldolgozva"
    Then the "Rendelésed megerősítésre került, minden rendben!" state is checked
    When the admin set the state of order to "PROCESSING"
    And the admin set the state of order to "READY"
    When the admin set the state of order to "SERVED"
    Then the "Rendelésed felszolgálásra/átvételre került." state is checked

  Scenario: Select tipping from the given options
    When I tap the "Borravaló" button
    Then I am on the "rating and tipping" screen
    Then I should see "Hogy sikerült a rendelésed?" text
    And I should see 5 options
    And I should see "Szeretnél borravalót adni?" text
    And I should see 4 options
    When I tap the "Csodás" option
    When I tap the "15%" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed és a borravalót megkaptuk!" dialog
    And I should see the "Rendelések" screen

  Scenario: Select Custom tipping
    When I tap the "Borravaló" button
    Then I am on the "rating and tipping" screen
    Then I should see "Hogy sikerült a rendelésed?" text
    When I tap the "Csodás" option
    And I should see "Szeretnél borravalót adni?" text
    And I tap the "Egyedi összeg" option
    And I tap the "Kész" button
    Then I should see "Egyedi borravaló" dialog
    And I should see my keyboard open
    When I type "5000" in the "Borravaló összege" input
    And I tap the "Kész" button
    Then I should see "5000 Ft" option selected
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed és a borravalót megkaptuk!" dialog
    Then I should see the "Rendelések" screen

  Scenario: Tipping from order history
    When I tap the "back arrow" button
    And I tap on the same order
    Then I should see "Hogy sikerült a rendelésed?" text
    When I tap the "Csodás" option
    Then I should see the option selected
    And I should see "Szeretnél borravalót adni?" text
    When I tap the "15%" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed és a borravalót megkaptuk!" dialog
    Then I should see the "Rendelések" screen
    When I tap the "Ma" button
    Then I should see "Rendelés állapota" screen
    And I should see "Borravaló" text
    And I should see "Borravaló összege 500Ft" text

  Scenario: Tipping from transaction history
    When I tap the "back arrow" button
    And I tap the "Profil" button
    And I tap the "Tranzakciók" option
    When I tap the "Borravaló" button
    Then I am on the "rating and tipping" screen
    Then I should see "Hogy sikerült a rendelésed?" text
    When I tap the "Csodás" option
    And I should see "Szeretnél borravalót adni?" text
    When I tap the "15%" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed és a borravalót megkaptuk!" dialog
    Then I should see the "Tranzakciók" screen
    When I tap the "Részletek" button
    Then I should see "Borravaló 500Ft" text
