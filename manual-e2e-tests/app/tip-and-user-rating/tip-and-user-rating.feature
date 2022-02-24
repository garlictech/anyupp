Feature: Tipping and user rating

  Background: I have a completed stripe order
    Given the admin add rating question "Hogy értékeled a nálunk szerzett élményeket?"
    And the admin set 3 tipping percents
    # 5%, 10%, 15%
    And the admin set the tipping min amount to "200"
    Given I am logged in as an anonym user
    And the language is set to HU
    And I am on the "Rendelések" screen
    And I have a completed stripe order

  Scenario: Tip and rating with stripe payment from order details screen
    # korábbi rendelések = order history
    Then I should see "Korábbi rendelések" text
    When I tap on the "Felszolgálva" order
    And I tap on the "Borravaló küldése" button
    Then I am on the tipping screen
    Then I should see "Szeretnél borravalót adni?" text
    And I should see 3 options
    # select tipping from the given options
    When I tap the "15%" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, a borravalót megkaptuk!" dialog
    When I tap anywhere to discard the screen
    Then I should see the "Rendelés állapota" screen
    When I tap on the "Rendelés értékelése" button
    Then I am on the rating screen
    Then I should see "Hogy értékeled a nálunk szerzett élményeket?" text
    And I should see 5 options
    When I tap the "Csodás" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed!" dialog
    When I tap on the "close" button
    Then I should see the "Rendelés állapota" screen

  Scenario: Tip and rating with stripe payment from app notification
    # from app noti, we should see the tip and rating on the same screen
    When I tap on the "Értékeld a legutóbbi rendelésed!" notification
    Then I should see 2 questions or text
    Then I should see "Hogy értékeled a nálunk szerzett élményeket?" text
    When I tap the "Csodás" option
    Then I should see "Szeretnél borravalót adni?" text
    # select Custom tipping
    And I tap the "Egyedi összeg" option
    Then I should see "Egyedi borravaló" dialog
    When I type "5000" in the "Borravaló összege (Ft)" input
    And I tap the "Kész" button
    Then I should see "5000 Ft" option selected
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed és a borravalót megkaptuk!" dialog
    When I tap on the "close" button
    Then I should see the "Rendelések" screen

  Scenario: Tipping from transaction history
    When I tap the "Profil" button
    And I tap on the "Vásárlások" option
    And I tap on my latest order
    When I tap on the "Rendelés értékelése" button
    Then I should see "Hogy értékeled a nálunk szerzett élményeket?" text
    When I tap the "Megfelelő" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, az értékelésed!" dialog
    When I tap anywhere to discard the screen
    When I tap on the "Borravaló küldése" button
    Then I should see "Szeretnél borravalót adni?" text
    And I should see 3 options
    When I tap the "5%" option
    And I tap the "Kész" button
    Then I should see "Köszönjük, a borravalót megkaptuk!" dialog
    When I tap anywhere to discard the screen
    Then I should see the "Rendelés állapota" screen
