Feature: Takeaway settings on admin

  Scenario: ORDER MODE settings on Unit form (only admin)
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Units" text
    Then the "Units" title is displayed
    When I click the edit button in the listitem with "Késdobáló #112" content
    Then I should see "Edit unit" text on the dialog
    And I should see "Order modes" text
    When I click on the "instant" checkbox
    And I click on the "pick up" checkbox
    Then I should see "Serving modes" text
    When I click on the "In place" checkbox
    And I click on the "Take away" checkbox
    And I click on the "Submit" button
    Then I should see a success toastr

  Scenario: TAX and ORDER MODE settings on Product forms (only admin)
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Products" text
    Then the "Products" title is displayed
    When I click on the "Group products" text
    When I click the category selector to set "Hamburgers"
    Then I should see "Sajtburger" text
    Then I should see "Fishburger" text
    Then I should see "Hamburger" text
    And On the active tab I click the edit button in the listitem with "Sajtburger" content
    Then I should see "Edit product" text on the dialog
    When I fill out the "tax" input with "28"
    And I fill out the "takeaway tax" input with "27"
    And I click on the "Submit" button
    Then I should see a success toastr
    And On the active tab I click the edit button in the listitem with "Sajtburger" content
    Then The "tax" input should contain "28"
    Then The "takeaway tax" input should contain "27"
    When I click on the close button
    Then The dialog should NOT exist
    When I click on the "Unit products" text
    When I click the category selector to set "Hamburgers"
    Then I should see "Sajtburger" text
    When On the active tab I click the edit button in the listitem with "Sajtburger" content
    Then I should see "Edit product" text on the dialog
    And I should see "Serving modes" text
    When I click on the "In place" checkbox
    And I click on the "Take away" checkbox
    And I click on the "Submit" button
    Then I should see a success toastr

  Scenario: admin assigned a take away modifier to a product
    Given I am on the dashboard as an authenticated superUser
    And I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon
    And I click on the "Modifiers and Extras" text
    Then the "Modifiers and Extras" title is displayed
    When I click on the button with title "Add product component"
    Then The dialog should be visible
    Then The chain selector should contain "Rab lánc #1"
    When I fill out the "Name (HU)" input with "Test component name" and some random text
    And I fill out the "Name (EN)" input with "Test component name" and some random text
    And I fill out the "Name (DE)" input with "Test component name" and some random text
    And I fill out the "Description" input with "test description"
    And I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    When I click on the "Modifiers and extras" link
    And I click on the button with title "Add modifier or extra"
    Then The chain selector should contain "Rab lánc #1"
    When I select "Extras" in the type selector
    And I fill out the "Name (HU)" input with "test extra"
    And I fill out the "Name (EN)" input with "test extra"
    And I fill out the "Name (DE)" input with "test extra"
    And I fill out the "Description" input with "test description"
    And I click on the "Take away" checkbox
    And I click the component selector to set "Test component name"
    And I fill out the "Max selection" input with "1"
    And I click on the "Add" button
    When I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    When I click on the menu icon
    And I click on the "Products" text
    And I click on the "Unit products" text
    And I click the category selector to set "Hamburgers"
    Then I should see "Sajtburger" text
    And On the active tab I click the edit button in the listitem with "Sajtburger" content
    Then I should see "Edit product" text on the dialog
    And I should see "Sajtburger" text on the dialog
    And I select the "test extra" in the modifier selector
    And I click on the "Add" button
    And I click on the "Submit" button
    Then I should see a success toastr
    And The dialog should NOT exist
    And I should see "Sajtburger" text