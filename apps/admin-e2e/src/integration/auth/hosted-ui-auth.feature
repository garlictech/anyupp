Feature: Login

  Background: Login page
    Given I am on the login page
    Then I should see "AnyUPP Admin" sub-header

  #Scenario: Forgotten password steps
  #When I click on the "Forgot your password?" text
  #Then I should see "Forgot your password?" header
  #When I fill out the username input with "test@anyupp.com"
  #And I click on the "Reset my password" button

  Scenario: Login with an e-mail and password
    When I fill out the input with id "username" with the "test@anyupp.com" value
    When I fill out the input with id "password" with the "Testtesttest12_" value
    And I click the "sign in" text
    When I should see "Account recovery requires verified contact information" sub-header
    And I click the "skip" text
    Then I should be on the dashboard page
#  And the "Dashboard" title is displayed
