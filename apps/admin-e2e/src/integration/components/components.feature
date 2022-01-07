Feature: Create and update components

  Background: Login and steps to the Modifiers
    Given I am on the dashboard as an authenticated superUser
    And I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Modifiers and Extras" text
    Then the "Modifiers and Extras" title is displayed

  Scenario: Create a new product component
    When I click on the button with title "Add product component"
    Then the "New product component" title is displayed
    When I click on the close button
    And The dialog should NOT exist
    Then the "Modifiers and Extras" title is displayed
    When I click on the button with title "Add product component"
    Then The dialog should be visible

    Then The chain selector should contain "Rab lánc #1"
    And I fill out the "Name (HU)" input with "test component 5 e2e" and some random text
    And I fill out the "Name (EN)" input with "test component 5 e2e" and some random text
    And I fill out the "Name (DE)" input with "test component 5 e2e" and some random text
    And I fill out the "Description" input with "test description"
    And I click on the "1. Gluten" checkbox
    And I click on the "2. Crustaceans" checkbox
    And I click on the "3. Egg" checkbox
    And I click on the "4. Fish" checkbox
    And I click on the "5. Peanut" checkbox
    And I click on the "6. Soya" checkbox
    And I click on the "7. Milk" checkbox
    And I click on the "8. Treenuts" checkbox
    And I click on the "9. Sulphites" checkbox
    And I click on the "10. Mustard" checkbox
    And I click on the "11. Celery" checkbox
    And I click on the "12. Sesame" checkbox
    And I click on the "13. Lupin" checkbox
    And I click on the "14. Molluscs" checkbox
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test component 5 e2e" text
    And On the active tab I should see "test description" text

  Scenario: Update a product component
    When On the active tab I click the edit button in the listitem with "test component 5 e2e" content
    Then The chain selector should contain "Rab lánc #1"
    When I fill out the "Name (HU)" input with "test component 5 e2e" and some random text
    And I fill out the "Name (EN)" input with "test component 5 e2e" and some random text
    And I fill out the "Name (DE)" input with "test component 5 e2e" and some random text
    And I fill out the "Description" input with "test description e2eUpdated"
    And I click on the "8. Treenuts" checkbox
    And I click on the "9. Sulphites" checkbox
    And I click on the "10. Mustard" checkbox
    And I click on the "11. Celery" checkbox
    And I click on the "12. Sesame" checkbox
    And I click on the "13. Lupin" checkbox
    And I click on the "14. Molluscs" checkbox
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test component 5 e2e" text
    And On the active tab I should see "test description e2eUpdated" text

  Scenario: Create an Extra component
    When I click on the "Modifiers and extras" link
    And I click on the button with title "Add modifier or extra"
    Then The chain selector should contain "Rab lánc #1"
    When I select "Extras" in the type selector
    And I fill out the "Name (HU)" input with "test extra"
    And I fill out the "Name (EN)" input with "test extra"
    And I fill out the "Name (DE)" input with "test extra"
    And I fill out the "Description" input with "test description"
    And I click the component selector to set "Cold"
    And I fill out the "Max selection" input with "1"
    And I click on the "Add" button
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test extra" text
    And On the active tab I should see "test description" text

  Scenario: Update an Extra
    When I click on the "Modifiers and extras" link
    And On the active tab I click the edit button in the listitem with "test extra" content
    Then The chain selector should contain "Rab lánc #1"
    And I fill out the "Name (HU)" input with "test extra e2eUpdated"
    And I fill out the "Name (EN)" input with "test extra e2eUpdated"
    And I fill out the "Name (DE)" input with "test extra e2eUpdated"
    And I fill out the "Description" input with "test description e2eUpdated"
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test extra e2eUpdated" text
    And On the active tab I should see "test description e2eUpdated" text

  Scenario: Create a Modifier component
    When I click on the "Modifiers and extras" link
    And I click on the button with title "Add modifier or extra"
    Then The chain selector should contain "Rab lánc #1"
    And I select "Modifier" in the type selector
    And I fill out the "Name (HU)" input with "test modifier"
    And I fill out the "Name (EN)" input with "test modifier"
    And I fill out the "Name (DE)" input with "test modifier"
    And I fill out the "Description" input with "test description"
    And I click the component selector to set "Rice"
    And I click on the "Add" button
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test modifier" text
    And On the active tab I should see "test description" text

  Scenario: Update a Modifier
    When I click on the "Modifiers and extras" link
    And On the active tab I click the edit button in the listitem with "test modifier" content
    Then The chain selector should contain "Rab lánc #1"
    And I fill out the "Name (HU)" input with "test modifier e2eUpdated"
    And I fill out the "Name (EN)" input with "test modifier e2eUpdated"
    And I fill out the "Name (DE)" input with "test modifier e2eUpdated"
    And I fill out the "Description" input with "test description e2eUpdated"
    And I click on the first "Delete" button
    And I click the component selector to set "Rice"
    And I click on the "Add" button
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And On the active tab I should see "test modifier e2eUpdated" text
    And On the active tab I should see "test description e2eUpdated" text
