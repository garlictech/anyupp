Feature: Dashboard header

    It can be tested at every type of views

Scenario: Dashboard zooming
  Given I am at the Dashboard
  And I am at the EN language
  And I am at the "Lane view"
  When I click on the Zoomer icon button right next to the "Time"
  Then the "Dashboard" title got bigger
  And the "Orders Accepted" button got bigger
  When I click on the "Zoomer" button right next to the "Time"
  Then the "Dashboard" title got bigger
  And the "Orders Accepted" button got bigger

Scenario: Block the orders
  Given I am at the Dashboard
  And I am at the EN language
  When I click on the "Orders Accepted" button
  Then the Confirm title displayed
  And the "Are you sure you block orders?" message displayed
  And the "Cancel" and the "OK" buttons displayed
  When I click on the "OK" button
  Then the "Orders Blocked" button displayed
  And the Orders got blocked

Scenario: Accept the orders
  Given I am at the Dashboard
  And I am at the EN language
  When I click on the "Orders Blocked" button
  Then the Confirm title displayed
  And the "Are you sure you accept orders?" message displayed
  And the "Cancel" and the "OK" buttons displayed
  When I click on the "OK" button
  Then the "Orders Accepted" button displayed
  And the Orders got accepted