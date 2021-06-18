Feature: Create or update Group

  Background: Login and steps to the Groups
    Given I am on the login page
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Hideghegy12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    When I click the "skip" text with timeout 15000
    Then I should be on the dashboard page
    # Set the desired lang
    Then I set the language to EN
    And I select the "Seeded chain #1" chain in the header menu
    When I click on the menu icon
    And I click on the "Groups" text
    Then the "Groups" title is displayed

  Scenario: Create new group
    And I click on the plus button
    Then the "New group" title is displayed
    When I click on the close button
    Then the "Groups" title is displayed
    When I click on the plus button
    Then The chain selector should contain "Seeded chain #1"
    When I set the currency to "HUF"
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
    When I click the edit button in the listitem with "test group 1" content
    And I set the currency to "EUR"
    And I fill out the "Name" input with "test group e2eUpdated"
    And I fill out the "Description (EN)" input with "test descripton e2eUpdated"
    And I fill out the "Description (HU)" input with "test descripton e2eUpdated"
    And I fill out the "Description (DE)" input with "test descripton e2eUpdated"
    And I fill out the "Email" input with "test123@anyupp.com"
    And I fill out the "Phone" input with "1234567890123"
    And I fill out the "Title" input with "test title updated"
    And I fill out the "Country" input with "Hungary"
    And I fill out the "Postal code" input with "1021"
    And I fill out the "City" input with "Budapest"
    And I fill out the "Address" input with "Kis u. 42."
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test group e2eUpdated" text
    And I should see "test descripton e2eUpdated" text
    And I should see "test123@anyupp.com" text
    And I should see "1234567890123" text
