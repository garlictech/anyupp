Feature: When you forgot your password

  Background: Login page
    Given I am on the login page

  Scenario: Check form texts
    Then I should see "AnyUpp Login" text
@focus
  Scenario: Cancel
    When I click on the "Forgotten password" text
    Then I should see "Cancel" text
    When I click on the "Cancel" text
    Then I should see "Forgotten password" text

  Scenario: Forgotten password
    When I click on the "Forgotten password" text
    When I fill out the "Email" input with "laura@bitgap.com"
    And I click on the "Send password reset mail" button
    # TODO: Then I should see "password" text
    # TODO: And I should see "login" button