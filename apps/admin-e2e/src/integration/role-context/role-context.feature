Feature: Role contexts

  Background: Login and steps to the Role contexts
    Given I am on the login page
    When I fill out the input with id "username" with the adminEmail value
    And I fill out the input with id "password" with the adminPassword value
    And I fill out the "Context" input with the superuserContextId id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Role contexts" text
    Then the "Role contexts" title is displayed

  Scenario: Add new role context
    When I click on the button with title "Add role context"
    Then the "New role context" title is displayed
    When I click on the close button
    Then the "Role contexts" title is displayed
    When I click on the button with title "Add role context"
    And I fill out the "Name (HU)" input with "test context"
    And I fill out the "Name (EN)" input with "test context"
    And I fill out the "Name (DE)" input with "test context"
    And I select the "Inactive" context in the selector
    And I click on the "Submit" button

  Scenario: Update role context
    When I click the edit button in the listitem with "test context" content
    And I fill out the "Name (HU)" input with "test context e2eUpdated"
    And I fill out the "Name (EN)" input with "test context e2eUpdated"
    And I fill out the "Name (DE)" input with "test context e2eUpdated"
    And I select the "Staff" context in the selector
    And I select the "Rab lánc #1" chain in the selector
    And I select the "Nagy csoport #1" group in the selector
    And I select the "Késdobáló #111" unit in the selector
    And I click on the "Submit" button
