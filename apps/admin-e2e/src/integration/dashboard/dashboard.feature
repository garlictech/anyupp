Feature: Dashboard

  Scenario: Floormap status updates
    When I create a cash order
    Then I should see "red" seat with "0201" id on the floormap
    Then I should see "red" border with "0201" id on the floormap
    When I set order status to "placed"
    Then I should see "orange" seat with "0201" id on the floormap
    When I set order status to "processing"
    Then I should see "blue" seat with "0201" id on the floormap
    When I set order status to "ready"
    Then I should see "purple" seat with "0201" id on the floormap
    When I set order status to "served"
    Then I should see "green" seat with "0201" id on the floormap
    When I set order transaction status to "success"
    Then I should see "brown" seat with "0201" id on the floormap
    Then I should see "black" border with "0201" id on the floormap
