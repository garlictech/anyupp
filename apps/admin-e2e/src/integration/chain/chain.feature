Feature: Create a new Chain

  Background: Login and steps to the Chains
    Given I am on the login page
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Hideghegy12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    When I click the "skip" text with timeout 15000
    Then I should be on the dashboard page
    # Set the desired lang
    Then I set the language to EN
    And I click on the menu icon
    And I click on the "Chains" text
    Then the "Chains" title is displayed

  Scenario: Create new chain
    When I click on the plus button
    Then the "New chain" title is displayed
    When I click on the close button
    Then the "Chains" title is displayed
    When I click on the plus button
    And I click on the "Active" checkbox
    And I fill out the "Name" input with "test chain 1"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    And I fill out the "Email" input with "test@anyupp.com"
    Then I should see 9 color picker with "#ffffff"
    When I click on the "Background (light)" picker fill out with "#fff9f0"
    And I fill out the "Phone" input with "1234567890"
    And I click on the "Background (dark)" picker fill out with "#d6d8e0"
    And I fill out the "Title" input with "test title"
    And I click on the "Text (light)" picker fill out with "#ffffff"
    And I fill out the "Country" input with "Hungary"
    And I click on the "Text (dark)" picker fill out with "#303030"
    And I click on the "Border (light)" picker fill out with "#e7dbd0"
    And I fill out the "Postal code" input with "1021"
    And I click on the "Border (dark)" picker fill out with "#c3c7cd"
    And I fill out the "City" input with "Budapest"
    And I click on the "Highlight" picker fill out with "#b67e2a"
    And I fill out the "Address" input with "Kis u. 45."
    And I click on the "Indicator" picker fill out with "#3097bf"
    And I click on the "Disabled" picker fill out with "#303030"
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test chain 1" text
    And I should see "test description" text
    And I should see "test@anyupp.com" text
    And I should see "1234567890" text

  Scenario: Update the Chain
    When I click the edit button in the listitem with "test chain 1" content
    And I fill out the "Name" input with "test chain e2eUpdated"
    And I fill out the "Description (HU)" input with "test descripton e2eUpdated"
    And I fill out the "Description (EN)" input with "test descripton e2eUpdated"
    And I fill out the "Description (DE)" input with "test descripton e2eUpdated"
    And I fill out the "Email" input with "test123@anyupp.com"
    And I click on the "Background (light)" picker fill out with "#ffffff"
    And I fill out the "Phone" input with "1234567890123"
    And I click on the "Background (dark)" picker fill out with "#d6dde0"
    And I fill out the "Title" input with "test title e2eUpdated"
    And I click on the "Text (light)" picker fill out with "#ffffff"
    And I fill out the "Country" input with "Hungary"
    And I click on the "Text (dark)" picker fill out with "#303030"
    And I click on the "Border (light)" picker fill out with "#e7e5d0"
    And I fill out the "Postal code" input with "9999"
    And I click on the "Border (dark)" picker fill out with "#c3cacd"
    And I fill out the "City" input with "Budapest e2eUpdated"
    And I click on the "Highlight" picker fill out with "#a8692a"
    And I fill out the "Address" input with "Kis u. 45. e2eUpdated"
    And I click on the "Indicator" picker fill out with "#30bf60"
    And I click on the "Disabled" picker fill out with "#303030"
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test chain e2eUpdated" text
    And I should see "test descripton e2eUpdated" text
    And I should see "test123@anyupp.com" text
    And I should see "1234567890123" text
