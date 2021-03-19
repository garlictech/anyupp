Feature: Admin login

  Login as an admin, with your e-mail and password.

  Background: Login page
    Given I am on the login page

  Scenario: Check form texts
    Then I should see "AnyUpp Login" header

  Scenario: Login with an e-mail and password
    When I click on the "Login" button
    Then I should see "Username" label
    And I should see "Password" label
    When I fill out the "Username" input with "laura@bitgap.com"
    And I fill out the "Password" input with "Laura23232"
    And I submit the form with "Sign in" button
#    And I click on the "Sign in" submit button
#    Then I should see the dashboard page
#    And the "Dashboard" title is displayed

# Scenario Outline: Login with an e-mail and password
#   When I fill out the "<input_name>" input with "<field_value>"
#   And I click on the "log in" button
#   Then I should see the dashboard page
#   And the "Dashboard" title is displayed

#   Examples:
#       | input_name | field_value      |
#       | Email      | laura@bitgap.com |
#       | Password   | Laura23232       | 
