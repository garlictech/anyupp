Feature: Authentication

  This feature contains the login, the log out and the forgotten password tests

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUPP Admin" sub-header

  Scenario: Login and log out
    When I fill out the input with id "username" with the "test-monad@anyupp.com" value
    And I fill out the input with id "password" with the "Hideghegy12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    Then I should see "John Doe" text
    And the "Dashboard" title is displayed
    When I click on the profile button
    And I click on the "Log out" title
    And I click on the "OK" title
    Then I should be on the login page
    And I should see "AnyUPP Admin" sub-header

  Scenario: Reset password
    When I delete all messages from the inbox
    When I click the "Reset password" text
    And I fill out the username input with the "anyupp-dev-b3182b@inbox.mailtrap.io" value
    And I click the "Send Code" text
    And I wait for the message
    And I read and type the verification code from the email
    And I click to the forgot password button
    Then I should be on the login page
