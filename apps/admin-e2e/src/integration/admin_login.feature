@login @admin
Feature: Admin logs in

    Login as an admin, with your e-mail and password.

Background: Login page
  Given I am on the admin "login" page

Scenario: Check form dialog
  Then I should see "AnyUpp Login" title

Scenario: Login with an e-mail and password
  When I fill out the email input with ""
  And I fill out the password input with ""
  And I click on the "log in" button
  Then I should be on the "Dashboard" page
  And I should see "Dashboard" title
