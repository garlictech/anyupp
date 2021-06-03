Feature: Authentication

  This feature contains the login, the log out and the forgotten password tests

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUPP Admin" sub-header

  Scenario: Login and log out
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Testtesttest12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    Then I should see "Account recovery requires verified contact information" sub-header
    When I click the "skip" text
    Then I should be on the dashboard page
    # Set the desired lang
    Then I set the language to EN
    Then I should see "John Doe" text
    And the "Dashboard" title is displayed
    When I click on the profile button
    And I click on the "Log out" title
    And I click on the "OK" title
    Then I should be on the login page
    And I should see "AnyUPP Admin" sub-header

  Scenario: Forgotten password steps
    When I click the "Reset password" text
    Then I should see "Reset your password" sub-header
    When I fill out the username input with the "test@anyupp.com" value
    Then I should see the Send Code button
    And I click the "Back to Sign In" text
    Then I should see "AnyUPP Admin" sub-header
