Feature: Whole product feature

  Background: Login and steps to the Chain products
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Products" text
    Then the "Products" title is displayed

  Scenario: Add new chain product
    When I click the category selector to set "Hamburgers"
    And I click on the button with title "Add product"
    Then The dialog should be visible
    And I should see "New product" text on the dialog
    When I fill out the "Name (HU)" input with "test chain product"
    And I fill out the "Name (EN)" input with "test chain product"
    And I fill out the "Name (DE)" input with "test chain product"
    And I fill out the "Description (HU)" input with "test chain description"
    And I fill out the "Description (EN)" input with "test chain description"
    And I fill out the "Description (DE)" input with "test chain description"
    Then I select the "Hamburgers" in the category selector
    And I select the "Drink" in the product type selector
    When I click on the "Add variant" button
    And I fill out the "Variant name (HU)" input with "test chain variant 1"
    And I fill out the "Variant name (EN)" input with "test chain variant 1"
    And I fill out the "Variant name (DE)" input with "test chain variant 1"
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
    And I select the "Garnish (Köret módosító készlet)" in the modifier selector
    And I click on the "Add" button
    And I select the "Decoration (Szolíd elegnacia)" in the modifier selector
    And I click on the "Add" button
    And I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    Then I should see "test product" text


  Scenario: Update chain product
    And I should see "Chain products" text
    When I click the category selector to set "Hamburgers"
    Then On the active tab I should see "test chain product" text
    When On the active tab I click the edit button in the listitem with "test chain product" content
    Then The dialog should be visible
    And I should see "Edit product" text on the dialog
    And The "Name (HU)" input should contain "test chain product"
    And The "Variant name (HU)" input should contain "test chain variant 1"
    When I fill out the "Name (HU)" input with "test chain e2eUpdated product"
    And I fill out the "Name (EN)" input with "test chain e2eUpdated product"
    And I fill out the "Name (DE)" input with "test chain e2eUpdated product"
    And I fill out the "Description (HU)" input with "test chain e2eUpdated description"
    And I fill out the "Description (EN)" input with "test chain e2eUpdated description"
    And I fill out the "Description (DE)" input with "test chain e2eUpdated description"
    Then The category selector should contain "Hamburgers"
    And I select the "Other" in the product type selector
    And I fill out the "Variant name (HU)" input with "test chain e2eUpdated variant HU"
    And I fill out the "Variant name (EN)" input with "test chain e2eUpdated variant EN"
    And I fill out the "Variant name (DE)" input with "test chain e2eUpdated variant DE"
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
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    When On the active tab I click the edit button in the listitem with "test chain e2eUpdated product" content
    Then The "Variant name (HU)" input should contain "test chain e2eUpdated variant HU"
    When I click on the close button
    Then The dialog should NOT exist
    And I should see "test chain e2eUpdated product" text
    And I should see "test chain e2eUpdated description" text
  # And I should see allergen icons

  Scenario: Add new group product
    When I click on the "Group products" text
    And I click the category selector to set "Hamburgers"
    Then On the active tab I should see "test chain e2eUpdated product" text
    When On the active tab I click the extend button in the listitem with "test chain e2eUpdated product" content
    Then I should see "Extend product" text on the dialog
    When I fill out the "Tax (%)" input with "27"
    # Variant prefill text
    And The "Variant name (HU)" input should contain "test chain e2eUpdated variant HU"
    And The "Variant name (EN)" input should contain "test chain e2eUpdated variant EN"
    And The "Variant name (DE)" input should contain "test chain e2eUpdated variant DE"
    And The "Pack size" input should contain "500"
    And The "Pack unit" input should contain "ml"
    # Variant changes
    And I fill out the "Variant name (HU)" input with "test group variant 1"
    And I fill out the "Variant name (EN)" input with "test group variant 1"
    And I fill out the "Variant name (DE)" input with "test group variant 1"
    And I fill out the "Pack size" input with "5"
    And I fill out the "Pack unit" input with "dl"
    And I click the delete button in the listitem with "Extra comp set" content
    And I select the "Extra comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_01_id)" in the modifier selector
    And I click on the "Add" button
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    And I should see a success toastr

  Scenario: Update group product
    When I click on the "Group products" text
    When I click the category selector to set "Hamburgers"
    And On the active tab I click the edit button in the listitem with "test chain e2eUpdated product" content
    Then I should see "Edit product" text on the dialog
    And I should see "test chain e2eUpdated product" text on the dialog
    And The "Variant name (HU)" input should contain "test group variant 1"
    When I fill out the "Tax (%)" input with "27"
    And I fill out the "Variant name (HU)" input with "test group e2eUpdated variant HU"
    And I fill out the "Variant name (EN)" input with "test group e2eUpdated variant EN"
    And I fill out the "Variant name (DE)" input with "test group e2eUpdated variant DE"
    And I fill out the "Pack size" input with "500"
    And I fill out the "Pack unit" input with "ml"
    And I click the delete button in the listitem with "Modifier comp set" content
    And I select the "Modifier comp set (PRODUCT_COMPONENT DESCRIPTION seeded_product_component_set_02_id)" in the modifier selector
    And I click on the "Add" button
    And I fill out all the "Reference price" input with index multiply by 10
    And I click on the "Submit" button
    And I should see a success toastr
    Then The dialog should NOT exist
    And On the active tab I click the edit button in the listitem with "test chain e2eUpdated product" content
    Then The "Variant name (HU)" input should contain "test group e2eUpdated variant HU"
    When I click on the close button
    Then The dialog should NOT exist

  Scenario: Add new unit product
    When I click on the "Unit products" text
    And I click the category selector to set "Hamburgers"
    And On the active tab I click the extend button in the listitem with "test chain e2eUpdated product" content
    Then I should see "Extend product" text on the dialog
    When I click the lane selector to set "konyha"
    And I click on the "Take away" checkbox
    And I click on the "In place" checkbox
    # Variant prefill text
    And The "Variant name (HU)" input should contain "test group e2eUpdated variant HU"
    And The "Variant name (EN)" input should contain "test group e2eUpdated variant EN"
    And The "Variant name (DE)" input should contain "test group e2eUpdated variant DE"
    And The "Pack size" input should contain "500"
    And The "Pack unit" input should contain "ml"
    # Variant changes
    And I fill out the "Variant name (HU)" input with "test unit variant 1"
    And I fill out the "Variant name (EN)" input with "test unit variant 1"
    And I fill out the "Variant name (DE)" input with "test unit variant 1"
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
    Then I should see a success toastr
    And The dialog should NOT exist

  Scenario: Update unit product
    When I click on the "Unit products" text
    When I click the category selector to set "Hamburgers"
    And On the active tab I click the edit button in the listitem with "test chain e2eUpdated product" content
    Then I should see "Edit product" text on the dialog
    And I should see "test chain e2eUpdated product" text on the dialog
    And The "Variant name (HU)" input should contain "test unit variant 1"
    When I click the lane selector to set "bár"
    And I click on the "Take away" checkbox
    And I click on the "Is visible" checkbox
    And I fill out the "Variant name (HU)" input with "test unit e2eUpdated variant HU"
    And I fill out the "Variant name (EN)" input with "test unit e2eUpdated variant EN"
    And I fill out the "Variant name (DE)" input with "test unit e2eUpdated variant DE"
    And I fill out the "Pack size" input with "200"
    And I fill out the "Pack unit" input with "ml"
    And I click on the "Is available" checkbox
    And I fill out all the "Price (HUF)" input with index multiply by 10
    And I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    When On the active tab I click the edit button in the listitem with "test chain e2eUpdated product" content
    Then The "Variant name (HU)" input should contain "test unit e2eUpdated variant HU"
    When I click on the close button
    Then The dialog should NOT exist
