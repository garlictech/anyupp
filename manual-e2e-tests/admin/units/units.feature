Feature: Units

  Background: Fill the form without POS
    When I fill out the units from
    Then the posType should be "Anyupp" 
    Then the Submit button should be enabled

  Scenario: Change unit POS type
    When I select "RKeeper" pos type
    Then the RKeepeR form should appear
    Then the "AnyUPP username" field should be filled with "user"
    Then the "AnyUPP password" field should be filled with random password
    When I click to the "Reset password" button
    Then the "AnyUPP password" field should be changed with a new password
    When I select "AnyUPP" pos type
    Then the RKeepeR form should be hidden
    When I select "RKeeper" pos type
    Then the RKeepeR form should appear, filled with the previous data
