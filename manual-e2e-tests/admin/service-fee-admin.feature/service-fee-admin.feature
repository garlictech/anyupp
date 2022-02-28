Feature: Service fee on admin, about the use cases

  Background: login
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu

  Scenario: Set the service of a unit
    When I click on the menu icon
    And I click on the "Units" text
    When I click the edit button in the listitem with "Késdobáló #112" content
    Then I should see "Service fee" text
    When I click on the "Type" button
    # Then I should see 3 options
    Then I should see "No service fee" text
    Then I should see "Fee included in all prices" text
    Then I should see "Fee not included in prices but applicable" text
    When I click on the "Fee included in all prices" option
    When I fill out the "Service fee" input with "10"
    When I fill out the "Tax" input with "10"
    When I click on the "Submit" button

  Scenario: service fee on print preview
    Then the "Dashboard" title is displayed
    # When I click on the first order
    And I click on the "printer-outline" icon
    Then I should see "Service fee:" text
    Then I should see "27%" text
    Then I should see "200 Ft" text
    When I click on the close button
