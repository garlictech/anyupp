Feature: Admin logs out

  Logout as an admin.

  Background: Dashboard page
    Given I am on the dashboard page

  Scenario: Check form texts
    When I click on the "user name" button
    Then I should see "profile" text
    And I should see "log out" text
@focus
  Scenario: Log out from admin profile
   When I click on the "log out" button
   Then I should see the login page
