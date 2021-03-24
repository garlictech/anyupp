Feature: Admin Dashboard

    It can be tested if there is more than 2 orders

Scenario: Lane checkboxes
  Given I am at the Dashboard
  And I am at the "EN" language
  When I click on the "Pult" checkbox below the Dashboard title
  Then all the Products displayed at the "Pult" lane

Scenario: Lane Views
  Given I am at the Dashboard
  And I am at the EN language
  When I click on the "Lane view"
  Then the "Placed" title displayed
  And the "Processing" title displayed
  And the "Ready" title displayed

Scenario: Scenario name

  


