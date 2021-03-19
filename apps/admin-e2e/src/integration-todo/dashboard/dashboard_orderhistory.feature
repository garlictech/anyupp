@order @history @calendar
Feature: Purpose of the Order History
    
    Feature Description

Background:
  Given I am at the Dashboard
  And I am at the EN language
  And I am at the "Order History" menu

Scenario: Order history Print button
  Given Start to type your Given step here
  When I click on the "Print" button on the right side
  Then the Receipt displayed

Scenario: Order history Calendar
  Given Start to type your Given step here
  When I click on the "Calendar" button next to the actual date
  Then the Calendar displayed
  And the actual date marked with blue color
  When I click on the "Arrow" button 
  Then the Month changed 
  When I click on a number of the date
  Then the picked date displayed
  And the order hitory of the date displayed