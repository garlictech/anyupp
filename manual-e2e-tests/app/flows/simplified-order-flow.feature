Feature: Simplified order flow

  Background: login and language
    Given I am logged in as an anonym user
    And the language is set to HU

  Scenario: Order creating without status and WITHOUT payment method
    Given I have my cart with products
    And I have NOT read the qr yet
    When I tap on the "Fizetek" button
    Then the app opens my camera
    And I should see "A rendeléshez olvasd be a QR kódot az asztalodon" text
    When I read my qr code
    Then I should see "Szék: #01, Asztal: #01" text
    When I tap on the "RENDBEN" button
    Then I should see "Sikeres rendelés!" text
    When I tap on the "RENDBEN" button
    Then I should see "Rendelések" screen
    When I tap on the order with "Rendelés leadva"
    Then I should see "Rendelés részletei" screen
    And I should NOT see the status of the order
    And the admin should see the order as archived

  Scenario: Order creating without status and WITH payment method
    Given I have my cart with products
    And I have NOT read the qr yet
    When I tap on the "Fizetek" button
    Then I should see "Fizetési mód" screen
    And I should see "Kártya, SZÉP kártya" option
    And I should see "Készpénz" option
    When I tap on the "Készpénz" button
    Then the app opens my camera
    And I should see "A rendeléshez olvasd be a QR kódot az asztalodon" text
    When I read my qr code
    Then I should see "Szék: #01, Asztal: #01" text
    When I tap on the "RENDBEN" button
    Then I should see "Sikeres rendelés!" text
    When I tap on the "RENDBEN" button
    Then I should see "Rendelések" screen
    And I should NOT see the status of the order
    When I tap on the order with "Rendelés leadva"
    Then I should see "Rendelés részletei" screen
    And I should NOT see the status of the order
    And the admin should see the archived order
