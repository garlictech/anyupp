Feature: Product categories

  Background: Login and steps to the Groups
    Given I am on the login page
    When I fill out the input with id "username" with the "test@anyupp.com" value
    And I fill out the input with id "password" with the "Testtesttest12_" value
    And I fill out the "Context" input with the "SU_CTX_ID" id
    And I click the "sign in" text
    When I click the "skip" text with timeout 15000
    Then I should be on the dashboard page
    Then I set the language to EN
    When I click on the menu icon
    And I click on the "Product categories" text
    Then the "Product categories (EN)" title is displayed

  Scenario: Add new category
    When I click on the plus button
    Then the "New product category" title is displayed
    And I fill out the "Name (HU)" input with "test category 1"
    And I fill out the "Name (EN)" input with "test category 1"
    And I fill out the "Name (DE)" input with "test category 1"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    And I click on the "Submit" button
    Then I should see "test category 1" text
    And I should see "test description" text

  Scenario: Update category
    When I click on the first Edit button
    And I fill out the "Name (HU)" input with "test category updated 1"
    And I fill out the "Name (EN)" input with "test category updated 1"
    And I fill out the "Name (DE)" input with "test category updated 1"
    And I fill out the "Description (HU)" input with "test description updated"
    And I fill out the "Description (EN)" input with "test description updated"
    And I fill out the "Description (DE)" input with "test description updated"
    And I click on the "Submit" button
    Then I should see "test category updated 1" text
    And I should see "test description updated" text

  Scenario: Add an other category
    When I click on the plus button
    And I fill out the "Name (HU)" input with "test category 3"
    And I fill out the "Name (EN)" input with "test category 3"
    And I fill out the "Name (DE)" input with "test category 3"
    And I fill out the "Description (HU)" input with "test description 3"
    And I fill out the "Description (EN)" input with "test description 3"
    And I fill out the "Description (DE)" input with "test description 3"
    And I click on the "Submit" button
    Then I should see "test category 3" text
    And I should see "test description 3" text

  Scenario: Change list position
    When I click on the Move down button
    When I click on the Move up button