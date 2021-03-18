Feature: Admin login

  Login as an admin, with your e-mail and password.

  Background: Login page
    Given I am on the login page

  Scenario: Check form texts
    Then I see "AnyUpp Login" header
    And I see "Email" label
    And I see "Password" label

 Scenario: Login with an e-mail and password
   When I fill out the "Email" input with "laura@bitgap.com"
   And I fill out the "Password" input with "Laura23232"
   And I click on the "log in" button
   Then I should see the dashboard page
   And the "Dashboard" title is displayed

# Scenario Outline: Login with an e-mail and password
#   When I fill out the "<input_name>" input with "<field_value>"
#   And I click on the "log in" button
#   Then I should see the dashboard page
#   And the "Dashboard" title is displayed

#   Examples:
#       | input_name | field_value      |
#       | Email      | laura@bitgap.com |
#       | Password   | Laura23232       | 
