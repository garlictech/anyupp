Feature: Admin users

  Background: Login and steps to the Admin users
    Given I am on the login page
    When I fill out the input with id "username" with the "test-monad@anyupp.com" value
    And I fill out the input with id "password" with the "Hideghegy12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Admins" text
    Then the "Admin users" title is displayed

  Scenario: Add new admin user
    When I click on the button with title "Add admin user"
    Then the "New admin user" title is displayed
    When I click on the close button
    Then the "Admin users" title is displayed
    When I click on the button with title "Add admin user"
    And I fill out the "Name" input with "test admin user"
    And I fill out the "Phone" input with "+3601234567890"
    And I fill out the "Email" input with "tesztteszt@anyupp.com"
    And I click on the "Submit" button
    Then I should see "test admin user" text

  Scenario: Update admin user
    When I click the edit button in the listitem with "test admin user" content
    And I fill out the "Name" input with "test admin user e2eUpdated"
    And I fill out the "Phone" input with "+3601234567899"
    And I fill out the "Email" input with "teszt-e2e@anyupp.com"
    And I click on the "Submit" button
    Then I should see "test admin user e2eUpdated" text
    And I click on the edit role button in the listitem with "test admin user e2eUpdated" content
    And I select the "Test superuser role context #1" in the role context selector
    And I click on the "Submit" button
    And I click on the close button
