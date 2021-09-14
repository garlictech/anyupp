Feature: Registrate an app user

  Scenario: Registrate an app user
    Given I am on the login screen
    When I tap the "Mail" icon
    And I tap the "Sign up..." text
    And I fill out the "Email" input with ""
    And I fill out the "Password" input with "Abc12345"
    And I fill out the "Password again" input with "Abc12345"
    And I tap the "Sign up" button
    Then I should see "We have sent theactivation email" text
    When I check the email that I got
    And I verify the registration Email
    Then I open the Anyupp again
    When I tap the "Sign in" text
    And I fill out the "Email" input with ""
    And I fill out the "Password" input with "Abc12345"
    And I tap the "Log in" button
    Then I should see the Unit selector screen
