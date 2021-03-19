Feature: Login

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUpp Login" header
    When I click on the "Login" button

  Scenario: Login with an e-mail and password
    Then I should see "Username" label
    And I should see "Password" label
    When I fill out the "Username" input with "laura@bitgap.com"
    And I fill out the "Password" input with "Laura23232"
    And I submit the form with "Sign in" button

  Scenario: Forgotten password steps
    When I click on the "Forgot your password?" text
    Then I should see "Forgot your password?" header
    When I fill out the username input with "laura@bitgap.com"
    And I click on the "Reset my password" button
    #TODO: next step