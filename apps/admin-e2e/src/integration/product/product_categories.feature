Feature: Product categories

  Background: Login and steps to the Groups
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Product categories" text
    Then the "Product categories (EN)" title is displayed

  Scenario: Change list position
    When I click the down arrow on the first productCategory item, it should become the second
    When I click the up arrow on the second productCategory item, it should become the first

  Scenario: Add new category
    When I click on the button with title "Add product category"
    Then the "New product category" title is displayed
    When I fill out the "Name (HU)" input with "test category 1"
    And I fill out the "Name (EN)" input with "test category 1"
    And I fill out the "Name (DE)" input with "test category 1"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    And I click on the "Submit" button
    Then I should see "test category 1" text
    And I should see "test description" text

  Scenario: Update category
    When I click the edit button in the listitem with "test category 1" content
    Then The "Name (HU)" input should contain "test category 1"
    When I fill out the "Name (HU)" input with "test e2eUpdated category"
    And I fill out the "Name (EN)" input with "test e2eUpdated category"
    And I fill out the "Name (DE)" input with "test e2eUpdated category"
    And I fill out the "Description (HU)" input with "test e2eUpdated description"
    And I fill out the "Description (EN)" input with "test e2eUpdated description"
    And I fill out the "Description (DE)" input with "test e2eUpdated description"
    And I click on the "Submit" button
    Then I should see "test e2eUpdated category" text
    And I should see "test e2eUpdated description" text
