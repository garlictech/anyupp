Feature: Create or update Unit

  Background: Login and steps to the Groups
    Given I am on the login page
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Testtesttest12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    When I click the "skip" text with timeout 15000
    Then I should be on the dashboard page
    # Set the desired lang
    Then I set the language to EN
    And I select the "Seeded chain #1" chain in the header menu
    And I select the "Seeded group #1" group in the header menu
    When I click on the menu icon
    And I click on the "Units" text
    Then the "Units" title is displayed

  Scenario: Create new unit
    When I click on the plus button
    Then the "New unit" title is displayed
    When I click on the close button
    Then the "Units" title is displayed
    When I click on the plus button
    Then The group selector should contain "Seeded group #1"
    When I fill out the "Name" input with "test unit 1"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    And I fill out the "Open from" input with "2021-05-05"
    And I fill out the "Open to" input with "2021-09-05"
    And I click on the "Active" checkbox
    And I click on the "Cash" checkbox
    And I click on the "Card" checkbox
    And I click on the "Google Pay" checkbox
    And I click on the "Apple Pay" checkbox
    And I click on the "Stripe" checkbox
    And I click on the "Simple" checkbox
    And I fill out the "Email" input with "test@anyupp.com"
    And I fill out the "Phone" input with "1234567890"
    And I fill out the "Title" input with "test title"
    And I fill out the "Country" input with "Hungary"
    And I fill out the "Postal code" input with "1021"
    And I fill out the "City" input with "Budapest"
    And I fill out the "Address" input with "Kis u. 45."
    And I click on the "Locate on map" button
    And I add a Custom date with "2022-12-12"
    And I fill all the hour inputs
    And I click on the "Add lane" button
    And I fill out the last "Name" input with "Lane"
    # And I click on the Color picker fill out with "#c0c0c0"
    And I click on the "Submit" button
    Then I should see "test unit 1" text
    And I should see "test description" text
    And I should see "test@anyupp.com" text
    And I should see "1234567890" text

  Scenario: Update the Unit and the activity
    When I click the edit button in the listitem with "test unit 1" content
    And I fill out the "Name" input with "test unit e2eUpdated"
    And I fill out the "Description (HU)" input with "test description e2eUpdated"
    And I fill out the "Description (EN)" input with "test description e2eUpdated"
    And I fill out the "Description (DE)" input with "test description e2eUpdated"
    And I fill out the "Open from" input with "2021-01-01"
    And I fill out the "Open to" input with "2022-01-01"
    And I click on the "Active" checkbox
    And I click on the "Cash" checkbox
    And I click on the "Card" checkbox
    And I click on the "Google Pay" checkbox
    And I click on the "Apple Pay" checkbox
    And I click on the "Stripe" checkbox
    And I click on the "Simple" checkbox
    And I fill out the "Email" input with "test123@anyupp.com"
    And I fill out the "Phone" input with "1234567890123"
    And I fill out the "Title" input with "test title e2eUpdated"
    And I fill out the "Country" input with "Hungary"
    And I fill out the "Postal code" input with "1021"
    And I fill out the "City" input with "Budapest"
    And I fill out the "Address" input with "Kis u. 42."
    And I click on the "Locate on map" button
    And I add a Custom date with "2022-12-24"
    And I fill all the hour inputs
    # TODO: redo this: currently the lastNameInput updates the unit's name not the lanes name
    # And I fill out the last "Name" input with "Lane updated"
    # And I click on the Color picker fill out with "#c17d5d"
    And I click on the "Submit" button
    Then I should see "test unit e2eUpdated" text
    And I should see "test description updated" text
    And I should see "test123@anyupp.com" text
    And I should see "1234567890123" text
