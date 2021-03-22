Feature: Dashboard header

Background: 
  Given I am on the dashboard page
  And I am on the "Lane view" button

#Scenario: Dashboard zooming
#  When I click on the "Zoomer" button
#  Then the "Dashboard" title is bigger
#  And the "Orders Accepted" button is bigger
#  When I click on the "Zoomer" button
#  Then the "Dashboard" title is smaller
#  And the "Orders Accepted" button is smaller

Scenario: Block the orders
  When I click on the "Orders Accepted" button
  Then the "Confirm" title is displayed
  And the "Are you sure you block orders?" title is displayed
  And the "Cancel" button is displayed
  And the "OK" button is displayed
  When I click on the "OK" button
  Then the "Orders Blocked" button is displayed

Scenario: Accept the orders
  When I click on the "Orders Blocked" button
  Then the "Confirm" title is displayed
  And the "Are you sure you accept orders?" title is displayed
  And the "Cancel" button is displayed
  And the "OK" button is displayed
  When I click on the "OK" button
  Then the "Orders Accepted" button is displayed