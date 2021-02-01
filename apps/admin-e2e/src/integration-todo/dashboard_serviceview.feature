Feature: Service view

    There should be at least one pending order

Scenario: 3 zones


Scenario: Placed and processing status
Given I am at the "Dashboard"
And I am at the EN language
And I am at the "Service view"
And I am at the Placed status
When I click 


Scenario: Ready status
  Given I am at the "Dashboard"
  And I am at the EN language
  When I click on the second "Ready status" button
  Then I should see the Ready order
  When I click ont the "Ready" button at the bottom of the list
  Then I should not see the order

Scenario: Waiting status
  Given I am at the "Dashboard"
  And I am at the EN language
  When I click on the third "Paying status" button
  Then I should see the Ready order
  When I click ont the "Ready" button at the bottom of the list
  Then I should not see the order 

Scenario: Edit the order