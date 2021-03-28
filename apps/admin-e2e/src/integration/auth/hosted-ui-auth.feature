Feature: Login

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUpp Login" header
    When I click on the "Login" button

  Scenario: Forgotten password steps
    When I click on the "Forgot your password?" text
    Then I should see "Forgot your password?" header
    When I fill out the username input with "test@test.com"
    And I click on the "Reset my password" button

  Scenario: Login with an e-mail and password
    Then I should see "Username" label
    And I should see "Password" label
    When I fill out the "Username" input with "test@test.com"
    And I fill out the "Password" input with "Testtesttest12_"
    And I submit the form with "Sign in" button
#    Then I should see the dashboard page
#    And the "Dashboard" title is displayed