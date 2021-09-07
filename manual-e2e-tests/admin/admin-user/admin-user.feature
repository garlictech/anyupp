Feature: Admin users

  Background: Login and steps to the Admin users
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Admins" text
    Then the "Admin users" title is displayed

  Scenario: Add new and edit admin user
    When I click on the button with title "Add admin user"
    Then the "New admin user" title is displayed
    When I click on the close button
    Then the "Admin users" title is displayed
    When I delete all messages from the mailtrap inbox
    And I click on the button with title "Add admin user"
    And I fill out the "Name" input with "Test User"
    And I fill out the "Phone" input with "+3601234567890"
    And I fill out the "Email" input with "anyupp-dev-b3182b@inbox.mailtrap.io"
    And I click on the "Submit" button
    Then I should see "Test User" text
    When I click the edit button in the listitem with "Test User" content
    And I fill out the "Name" input with "Test User e2e upd"
    And I fill out the "Phone" input with "+3601234567899"
    And I click on the "Submit" button
    Then I should see "Test User e2e upd" text
    And I click on the edit role button in the listitem with "Test User e2e upd" content
    And I select the "Test superuser role context #1" in the role context selector
    And I click on the "Submit" button
    And I click on the close button
    And I click to the header user button
    And I click on the "Log out" title
    And I click on the "OK" title
    Then I should be on the login page
    And I fill out the input with id "username" with the "anyupp-dev-b3182b@inbox.mailtrap.io" value
    And I wait for the message
    And I read and type the temporary password from the email
    And I fill out the "Context" input with the superuserContextId id
    And I click the "sign in" text
    Then I should see "Change Password" text
    And I type the new password to the password input
    And I click to the change password button
    Then I should be on the dashboard page
    And I click to the header user button
    And I click on the "Log out" title
    And I click on the "OK" title
    Then I should be on the login page
    And I delete all messages from the mailtrap inbox
    And I click the "Reset password" text
    And I fill out the last input with id "username" with the "anyupp-dev-b3182b@inbox.mailtrap.io" value
    And I click the "Send Code" text
    And I wait for the message
    And I read and type the verification code from the email
    And I set the new password
    And I click the "SUBMIT" button
    # And I click to the forgot password button
    Then I should be on the login page
