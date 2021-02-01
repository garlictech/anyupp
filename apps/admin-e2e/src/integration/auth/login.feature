Feature: Admin login

  Login as an admin, with your e-mail and password.

  Background: Login page
    Given I am on the login page

  Scenario: Check form title
    Then I should see "AnyUpp Login" text

# Scenario: Login with an e-mail and password
#   When I fill out the "Email" input with "emaillll"
#   And I fill out the "Password" input with "passwordddd"
#   And I click on the "log in" button
#   Then I should be on the Dashboard page
#   And I should see "Dashboard" title
