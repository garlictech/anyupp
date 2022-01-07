Feature: Simplified order flow

  Scenario: Order creating without status and WITHOUT payment method
    Given I have my cart with products
    And I have NOT read the qr yet
    When I tap on the "Rendelek" button
    Then the app opens my camera
    And I should see "A rendeléshez olvasd be a QR kódot az asztalodon" text
    When I read my qr code
    Then I should see "Sikeres rendelés!" text
    When I tap on the "RENDBEN" button
    Then I should see "Rendelések" screen
    When I tap on the order with "Rendelés leadva"
    Then I should see "Rendelések" screen
    And I should NOT see the status of the order
    When I tap on the order with "Rendelés leadva"
    Then I should see "Rendelés részletei" screen
    And I should NOT see the status of the order
    And the admin should see the archived order

  Scenario: Order creating without status and WITH payment method
    Given I have my cart with products
    And I have NOT read the qr yet
    When I tap on the "Fizetek (3170 FT)" button
    Then I should see "Fizetési mód" screen
    When I select "Mastercard" option
    When I tap on the "Megrendelés" button
    Then the app opens my camera
    And I should see "A rendeléshez olvasd be a QR kódot az asztalodon" text
    When I read my qr code
    Then I should see "Sikeres rendelés!" text
    When I tap on the "RENDBEN" button
    Then I should see "Rendelések" screen
    And I should NOT see the status of the order
    When I tap on the order with "Rendelés leadva"
    Then I should see "Rendelés részletei" screen
    And I should NOT see the status of the order
    And the admin should see the archived order
