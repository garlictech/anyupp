Feature: Service fee on admin, about the use cases

  Scenario: Unit
    When I click the edit button in the listitem with "Késdobáló #111" content
    Then The "Name" input should contain "Késdobáló #111"
    Then I should see "Service fee policies" text
    And there is the "no service fee" option
    And there is the "fee included in all prices" option
    And there is the "fee not included in prices but applicable" option
