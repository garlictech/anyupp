Feature: Cashboard

  Background: Login and steps to the dashboard
    Given I am on the dashboard as an authenticated superUser
    Then the "Dashboard" title is displayed

  Scenario: Floormap
    When I click the "floorMapAction" button
    And I click on the #"01" seat of #"01" table
    Then the "Seat #01/01" title is displayed
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed
    And I click on the #"01" table
    Then the "Table #01" title is displayed
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed