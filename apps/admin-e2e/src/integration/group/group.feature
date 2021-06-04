Feature: Create or update Group

  Background: Login and steps to the Groups
    Given I am on the login page
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Testtesttest12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    When I click the "skip" text
    Then I should be on the dashboard page
    When I click on the menu icon
    And I click on the "Groups" text
    Then the "Groups" title is displayed

  Scenario: Check form page
    And I click on the plus button
    Then the "New group" title is displayed
    When I click on the close button

  Scenario: Create new group
    When I click on the plus button
    And I set the currency to "HUF"
    And I fill out the "Name" input with "test group 1"
    And I fill out the "Description (HU)" input with "test descripton 1"
    And I fill out the "Description (EN)" input with "test descripton 1"
    And I fill out the "Description (DE)" input with "test descripton 1"
    And I fill out the "Email" input with "test@anyupp.com"
    And I fill out the "Phone" input with "1234567890"
    And I fill out the "Title" input with "test title"
    And I fill out the "Country" input with "Hungary"
    And I fill out the "Postal code" input with "1021"
    And I fill out the "City" input with "Budapest"
    And I fill out the "Address" input with "Kis u. 45."
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test group 1" text
    And I should see "test descripton 1" text
    And I should see "test@anyupp.com" text
    And I should see "1234567890" text

  Scenario: Update the Group
    When I click on the first Edit button
    And I set the currency to "EUR"
    And I fill out the "Name" input with "test group 1 updated"
    And I fill out the "Description (EN)" input with "test descripton 1 updated"
    And I fill out the "Description (HU)" input with "test descripton 1 updated"
    And I fill out the "Description (DE)" input with "test descripton 1 updated"
    And I fill out the "Email" input with "test123@anyupp.com"
    And I fill out the "Phone" input with "1234567890123"
    And I fill out the "Title" input with "test title updated"
    And I fill out the "Country" input with "Hungary"
    And I fill out the "Postal code" input with "1021"
    And I fill out the "City" input with "Budapest"
    And I fill out the "Address" input with "Kis u. 42."
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test group 1 updated" text
    And I should see "test descripton 1 updated" text
    And I should see "test123@anyupp.com" text
    And I should see "1234567890123" text