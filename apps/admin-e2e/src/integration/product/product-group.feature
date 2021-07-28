Feature: Group product

  Background: Login and steps to the Group products
    Given I am on the login page
    When I fill out the input with id "username" with the adminEmail value
    And I fill out the input with id "password" with the adminPassword value
    And I fill out the "Context" input with the superuserContextId id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Products" text
    Then the "Products" title is displayed

  Scenario: Add new group product
    When I click on the "Group products" text
    And On the active tab I click the extend button in the listitem with "test product e2eUpdated" content
    Then the "Extend product" title is displayed
    When I fill out the "Tax (%)" input with "27"
    And I click on the "Is visible" checkbox
    And I fill out the "Variant name (HU)" input with "test variant 1"
    And I fill out the "Variant name (EN)" input with "test variant 1"
    And I fill out the "Variant name (DE)" input with "test variant 1"
    And I fill out the "Pack size" input with "5"
    And I fill out the "Pack unit" input with "dl"
    And I click on the "Is available" checkbox
    And I select the "test extra e2eUpdated (test description e2eUpdated)" in the modifier selector
    And I click on the "Add" button
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    Then I should see "test product e2eUpdated" text
    And I should see "test description e2eUpdated" text

  Scenario: Update group product
    When I click on the "Group products" text
    And On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then the "Edit product" title is displayed
    When I fill out the "Tax (%)" input with "27"
    And I click on the "Is visible" checkbox
    And I fill out the "Variant name (HU)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (EN)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (DE)" input with "test variant e2eUpdated"
    And I fill out the "Pack size" input with "500"
    And I fill out the "Pack unit" input with "ml"
    And I click on the "Is available" checkbox
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    Then I should see "test product e2eUpdated" text
    And I should see "test description e2eUpdated" text
