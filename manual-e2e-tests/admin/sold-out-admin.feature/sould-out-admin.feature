Feature: Sold out items admin

  Background: login
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #112" unit in the header menu
    When I click on the menu icon

  Scenario: set unit to sold out policy
    When I click on the "Units" text
    When I click the edit button in the listitem with "Késdobáló #112" content
    Then I should see "Sold out policy" text
    Then I should see "Visible as faded if sold out" text
    When I click on the "Visible as faded if sold out" button
    Then I should see "Not visible if sold out" text
    When I click on the "Not visible if sold out" option
    And I click on the "Submit" button

  Scenario: set a modifier and a product to sold out
    When I click on the "Modifiers and Extras" text
    When I click the edit button in the listitem with "Rice" content
    Then I should see "Sold out" text
    When I click on the "Sold out" checkbox
    And I click on the "Submit" button
    # Then the "Rice" is inactive
    When I click on the "Products" text
    When I click on the "Unit products" text
    When I click the edit button in the listitem with "Coca-Cola" content
    # Then I should see 2 "Sold out" text
    # When I click on the first "Sold out" checkbox
    And I click on the "Submit" button
# Then the "Coca-Cola" is inactive
