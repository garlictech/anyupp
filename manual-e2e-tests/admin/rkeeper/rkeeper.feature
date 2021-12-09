Feature: Admin RKeepeR


  Background: Login and steps to the Groups
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    When I click on the menu icon
    And I click on the "Units" text
    Then the "Units" title is displayed

  Scenario: Setting up RKeepeR
    When I click the edit button in the listitem with “Késdobáló #111 ” content
    Then I should see "Edit unit" page
    When I click the "RKeepeR" button
    When I fill out the "Endpoint URI" input with "test endpoint uri"
    And I fill out the "RKeepeR username" input with "test rkeeper username"
    And I fill out the "RKeepeR password" input with "testpassword"
    And I fill out the "AnyUPP username" input with "test user"
    And I fill out the "Restaurant ID" input with "test ID"
    When I click on the "Reset password" button
    Then I should see 8 random characters
    When I click on the "Submit" button
    Then I should see a success toastr
