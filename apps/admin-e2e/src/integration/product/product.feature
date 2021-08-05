Feature: Whole product feature

  Background: Login and steps to the Chain products
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

  Scenario: Add new chain product
    When I click the category selector to set "Test product category #1 name"
    And I click on the button with title "Add product"
    Then the "New product" title is displayed
    When I fill out the "Name (HU)" input with "test product"
    And I fill out the "Name (EN)" input with "test product"
    And I fill out the "Name (DE)" input with "test product"
    And I fill out the "Description (HU)" input with "test description"
    And I fill out the "Description (EN)" input with "test description"
    And I fill out the "Description (DE)" input with "test description"
    Then I select the "Test product category #1 name" in the category selector
    And I select the "Drink" in the product type selector
    When I click on the "Add variant" button
    And I fill out the "Variant name (HU)" input with "test variant 1"
    And I fill out the "Variant name (EN)" input with "test variant 1"
    And I fill out the "Variant name (DE)" input with "test variant 1"
    And I fill out the "Pack size" input with "0.5"
    And I fill out the "Pack unit" input with "liter"
    And I click on the "1. Gluten" checkbox
    And I click on the "2. Crustaceans" checkbox
    And I click on the "3. Egg" checkbox
    And I click on the "4. Fish" checkbox
    And I click on the "5. Peanut" checkbox
    And I click on the "6. Milk" checkbox
    And I click on the "7. Soya" checkbox
    And I click on the "8. Treenuts" checkbox
    And I click on the "9. Sulphites" checkbox
    And I click on the "10. Mustard" checkbox
    And I click on the "11. Celery" checkbox
    And I click on the "12. Sesame" checkbox
    And I click on the "13. Lupin" checkbox
    And I click on the "14. Molluscs" checkbox
    And I select the "Extra comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_01_id)" in the modifier selector
    And I click on the "Add" button
    And I select the "Modifier comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_02_id)" in the modifier selector
    And I click on the "Add" button
    And I click on the "Submit" button
    Then I should see "test product" text
    # Scenario: Update chain product
    And I should see "Chain products" text
    When I click the category selector to set "Test product category #1 name"
    When On the active tab I click the edit button in the listitem with "test product" content
    Then the "Edit product" title is displayed
    Then I should see "test product" text
    Then I should see "test variant 1" text
    When I fill out the "Name (HU)" input with "test product e2eUpdated"
    And I fill out the "Name (EN)" input with "test product e2eUpdated"
    And I fill out the "Name (DE)" input with "test product e2eUpdated"
    And I fill out the "Description (HU)" input with "test description e2eUpdated"
    And I fill out the "Description (EN)" input with "test description e2eUpdated"
    And I fill out the "Description (DE)" input with "test description e2eUpdated"
    Then The category selector should contain "Test product category #1 name"
    And I select the "Other" in the product type selector
    And I fill out the "Variant name (HU)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (EN)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (DE)" input with "test variant e2eUpdated"
    And I fill out the "Pack size" input with "500"
    And I fill out the "Pack unit" input with "ml"
    And I click on the "1. Gluten" checkbox
    And I click on the "3. Egg" checkbox
    And I click on the "5. Peanut" checkbox
    And I click on the "7. Soya" checkbox
    And I click on the "9. Sulphites" checkbox
    And I click on the "11. Celery" checkbox
    And I click on the "13. Lupin" checkbox
    And I click the delete button in the listitem with "Modifier comp set" content
    And I select the "Modifier comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_02_id)" in the modifier selector
    And I click on the "Add" button
    And I click on the "Submit" button
    When On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then I should see "test variant e2eUpdated" text
    When I click on the close button

  Scenario: Add new group product
    When I click on the "Group products" text
    And I click the category selector to set "Test product category #1 name"
    Then I should see "test product e2eUpdated" text
    When On the active tab I click the extend button in the listitem with "test product e2eUpdated" content
    Then the "Extend product" title is displayed
    When I fill out the "Tax (%)" input with "27"
    And I fill out the "Variant name (HU)" input with "test variant 1"
    And I fill out the "Variant name (EN)" input with "test variant 1"
    And I fill out the "Variant name (DE)" input with "test variant 1"
    And I fill out the "Pack size" input with "5"
    And I fill out the "Pack unit" input with "dl"
    And I click the delete button in the listitem with "Extra comp set" content
    And I select the "Extra comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_01_id)" in the modifier selector
    And I click on the "Add" button
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    # Scenario: Update group product
    Then I should see "Group products" text
    When I click the category selector to set "Test product category #1 name"
    And On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then the "Edit product" title is displayed
    And I should see "test product e2eUpdated" text
    And I should see "test variant 1" text
    When I fill out the "Tax (%)" input with "27"
    And I fill out the "Variant name (HU)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (EN)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (DE)" input with "test variant e2eUpdated"
    And I fill out the "Pack size" input with "500"
    And I fill out the "Pack unit" input with "ml"
    And I click the delete button in the listitem with "Modifier comp set" content
    And I select the "Modifier comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_02_id)" in the modifier selector
    And I click on the "Add" button
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    And On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then I should see "test variant e2eUpdated" text
    When I click on the close button

  Scenario: Add new unit product
    When I click on the "Unit products" text
    And I click the category selector to set "Test product category #1 name"
    And On the active tab I click the extend button in the listitem with "test product e2eUpdated" content
    Then the "Extend product" title is displayed
    When I click the lane selector to set "konyha"
    And I click on the "Takeaway" checkbox
    And I fill out the "Variant name (HU)" input with "test variant 1"
    And I fill out the "Variant name (EN)" input with "test variant 1"
    And I fill out the "Variant name (DE)" input with "test variant 1"
    And I fill out the "Pack size" input with "5"
    And I fill out the "Pack unit" input with "dl"
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
    # Scenario: Update unit product
    Then I should see "Unit products" text
    When I click the category selector to set "Test product category #1 name"
    And On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then the "Edit product" title is displayed
    And I should see "test product e2eUpdated" text
    And I should see "test variant 1" text
    When I click the lane selector to set "bár"
    And I click on the "Takeaway" checkbox
    And I click on the "Is visible" checkbox
    And I fill out the "Variant name (HU)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (EN)" input with "test variant e2eUpdated"
    And I fill out the "Variant name (DE)" input with "test variant e2eUpdated"
    And I fill out the "Pack size" input with "200"
    And I fill out the "Pack unit" input with "ml"
    And I click on the "Is available" checkbox
    And I fill out all the "Price (HUF)" input with index multiply by 10
    And I click on the "Submit" button
    And On the active tab I click the edit button in the listitem with "test product e2eUpdated" content
    Then I should see "test variant e2eUpdated" text
