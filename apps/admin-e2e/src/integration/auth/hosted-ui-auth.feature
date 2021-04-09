Feature: Login

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUPP Admin" header

  Scenario: Forgotten password steps
    When I click on the "Reset your password" text
    Then I should see "Reset your password" header
    When I fill out the username input with "test@anyupp.com"
    And I click on the "send code" button

@focus
  Scenario: Login with an e-mail and password
    Then I should see "Username *" label
    And I should see "Password *" label
    When I fill out the "Username *" input with "test@anyupp.com"
    And I fill out the "Password *" input with "Testtesttest12_"
    And I submit the form with "Sign in" button
    # Then I should see the dashboard page
    # Then the "Dashboard" title is displayed
