Feature: Create a new Chain

  Background: Login and steps to the Chains
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I click on the menu icon
    And I click on the "Chains" text
    Then the "Chains" title is displayed

  Scenario: Create new chain
    When I click on the button with title "Add chain"
    Then the "New chain" title is displayed
    When I click on the close button
    Then the "Chains" title is displayed
    When I click on the button with title "Add chain"
    And I click on the "Active" checkbox
    And I fill out the "Name" input with "test chain e2e"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    And I fill out the "Email" input with a fixture adminEmail
    Then I should see 11 color picker with "#ffffff"
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
    And I click on the "Primary" picker fill out with "#404040"
    And I click on the "Secondary" picker fill out with "#505050"
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test chain e2e" text
    And I should see "test description" text
    And I should see the adminEmail fixture
    And I should see "1234567890" text

  Scenario: Update the Chain
    When I click the edit button in the listitem with "test chain e2e" content
    Then The "Name" input should contain "test chain e2e"
    When I fill out the "Name" input with "test e2eUpdated chain"
    And I fill out the "Description (HU)" input with "test e2eUpdated description"
    And I fill out the "Description (EN)" input with "test e2eUpdated description"
    And I fill out the "Description (DE)" input with "test e2eUpdated description"
    And I fill out the "Email" input with "test123@anyupp.com"
    And I click on the "Background (light)" picker fill out with "#ffffff"
    And I fill out the "Phone" input with "1234567890123"
    And I click on the "Background (dark)" picker fill out with "#d6dde0"
    And I fill out the "Title" input with "test e2eUpdated title"
    And I click on the "Text (light)" picker fill out with "#ffffff"
    And I fill out the "Country" input with "Hungary"
    And I click on the "Text (dark)" picker fill out with "#303030"
    And I click on the "Border (light)" picker fill out with "#e7e5d0"
    And I fill out the "Postal code" input with "9999"
    And I click on the "Border (dark)" picker fill out with "#c3cacd"
    And I fill out the "City" input with "BudaE2eUpdatedpest"
    And I click on the "Highlight" picker fill out with "#a8692a"
    And I fill out the "Address" input with "Kis u. 45e2eUpdated."
    And I click on the "Indicator" picker fill out with "#30bf60"
    And I click on the "Disabled" picker fill out with "#303030"
    And I click on the "Primary" picker fill out with "#404040"
    And I click on the "Secondary" picker fill out with "#505050"
    And I click on the "Locate on map" button
    And I click on the "Submit" button
    Then I should see "test e2eUpdated chain" text
    And I should see "test e2eUpdated description" text
    And I should see "test123@anyupp.com" text
    And I should see "1234567890123" text
