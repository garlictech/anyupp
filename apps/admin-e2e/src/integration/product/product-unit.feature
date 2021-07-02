Feature: Unit product

  Background: Login and steps to the Unit products
    Given I am on the login page
    When I fill out the input with id "username" with the "test-monad@anyupp.com" value
    And I fill out the input with id "password" with the "Hideghegy12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Products" text
    Then the "Products" title is displayed

  Scenario: Add new unit product
    When I click on the "Unit products" text
    And I click the extend button in the listitem with "test product e2eUpdated" content
    Then the "Extend product" title is displayed
    When I click the lane selector to set "konyha"
    And I click on the "Takeaway" checkbox
    And I click on the "Is visible" checkbox
    And I fill out the "Variant name (HU)" input with "test variant 1"
    And I fill out the "Variant name (EN)" input with "test variant 1"
    And I fill out the "Variant name (DE)" input with "test variant 1"
    And I fill out the "Pack size" input with "5"
    And I fill out the "Pack unit" input with "dl"
    And I click on the "Is available" checkbox
    And I click on the "Add availability" button
    And I select "Always" in the type selector
    And I click on the "Add availability" button
    And I select "Weekly" in the type selector
    And I click the "dayFrom" day selector to set "Monday"
    And I click the "dayTo" day selector to set "Wednesday"
    And I fill out the "Time from" input with "10:00"
    And I fill out the "Time to" input with "13:00"
    And I click on the "Add availability" button
    And I select "Seasonal" in the type selector
    And I fill out the "Day from" input with "2021-05-01"
    And I fill out the "Day to" input with "2021-10-01"
    And I fill out the last "Time from" input with "10:00"
    And I fill out the last "Time to" input with "18:00"
    And I fill out all the "Price (HUF)" input with index multiply by 10
    And I click on the "Submit" button
    Then I should see "test product e2eUpdated" text
    And I should see "test description e2eUpdated" text
