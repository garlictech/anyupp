Feature: After pay feature

  About the wiki use cases

  Scenario: after pay
    Given I am logged in as an anonym user
    And the language is set to HU
    And I have my cart with products
    Then I should see the "Étlap" screen
    When I tap on the "KOSARAM" button
    And I tap on the "RENDELEK" button
    And I tap on the "RENDBEN" button
    Then I should see the "Rendelések" screen
    When the admin set the order to "served" status
    Then I should see "Fizetésre vár" on the order card
    And I tap on the "FIZETEK" button
    Then I should see the "FIZETÉSI MÓD" screen
    And I should see 3 types of payment
    And I should see my saved card if I did before
    And I should see the invoice option
