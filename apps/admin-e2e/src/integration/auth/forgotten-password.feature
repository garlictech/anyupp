Feature: When you forgot your password

  Background: Login page
    Given I am on the login page

  Scenario: Check form texts
    Then I should see "AnyUpp Login" text

  Scenario: Forgotten password steps
    When I click on the "Login" button
    And I click on the "Forgot your password?" text
    Then I should see "Forgot your password?" header
    When I fill out the username input with "laura@bitgap.com"
    And I click on the "Reset my password" button
    # TODO: 