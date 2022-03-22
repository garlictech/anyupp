Feature: Pre pay feature

  About the wiki use cases

  Scenario: pre pay
    Given I am logged in as an anonym user
    And the language is set to HU
    And I have my cart with products
    Then I should see the "Étlap" screen
    When I tap on the "KOSARAM" button
    And I tap on the "FIZETEK" button
    And I should see the "MEGRENDELÉSI MÓD" screen
    And I should see the "Most kérem" option
    And I should see the "Időzített rendelés" option
    And I tap on the "Most kérem" option
    And I tap on the "TOVÁBB A FIZETÉSHEZ" button
    Then I should see the "FIZETÉSI MÓD" screen
    And I should see 3 types of payment
    And I should see my saved card if I did before
    And I should see the invoice option
