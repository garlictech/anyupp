Feature: Pre order, pick up order feature

  About the wiki use cases

  Scenario: pre order
    Given I am logged in as an anonym user
    And the language is set to HU
    And I should see the "Home" screen
    And I should see "pre order takeaway" mode in some units
    And I choose "pre order takeaway" in a unit
    Then I should see the "Étlap" screen
    And I have my cart with products
    When I tap on the "KOSARAM" button
    And I tap on the "FIZETEK" button
    And I should see the "MEGRENDELÉSI MÓD" screen
    And I should see the "Most kérem" option
    And I should see the "Időzített rendelés" option
    And I tap on the "Most kérem" option
    And I tap on the "TOVÁBB A FIZETÉSHEZ" button
    Then I should see the "FIZETÉSI MÓD" screen

  Scenario: pre order in a closed unit

# As an AnyUpp user I can see the order mode “pre order takeaway” if I am located anywhere else than the unit I’m choosing to order from.
# As an AnyUpp user I can only create orders from a currently closed unit in “pre order takeaway” mode if the unit is available for that order mode.
# As an AnyUpp user I can see the menu of a closed unit, but I can’t make orders if the unit does not have made “pre order takeaway” available.
