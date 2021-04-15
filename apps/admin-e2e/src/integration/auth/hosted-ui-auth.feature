Feature: Login

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUPP Admin" sub-header

  Scenario: Forgotten password steps
    When I click the "Reset password" text
    Then I should see "Reset your password" sub-header
    When I fill out the username input with the "test@anyupp.com" value
    And I click the "send code" text
    Then the "Verification code" label is displayed
    And the "New password" label is displayed
    When I fill out the code input with the "123" value
    And I fill out the password input with the "12345" value
    And I click the "submit" text
  # And I click the "back to sign in" text

  Scenario: Login with an e-mail and password
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Testtesttest12_" value
    And I click the "sign in" text
    Then I should see "Account recovery requires verified contact information" sub-header
    When I click the "skip" text
    Then I should be on the dashboard page
    And the "Dashboard" label is displayed
