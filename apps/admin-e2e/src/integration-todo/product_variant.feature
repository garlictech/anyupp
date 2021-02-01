@variant @edit @product @chain @group @unit
Feature: Edit product variant

    The product variants can be edited at the Chain, Group and Unit products. We have the Chain, the Group
    and the Unit editing interfaces. 

Background:
  Given I am logged in
  And I am at the "english" language
  And I am at the "Products" page
  And I am on the first "Edit" button

Scenario: Hidden dialogs after editing
  Given 

Scenario: Rename a variant
  Given I am
  When I fill out the name input with "csirke leves"
  And I click on the submit button
  Then the "csirke leves" displayed

Scenario: Variant character name limit to 40
  Then the "Edit Product" title is displayed
  And the "Variants" title displayed
  When I fill out the name input with "csirke levescsirke levescsirke levescsirke levescsirke levescsirke leves"
  Then the submit button is disabled

Scenario: Resize variant with numbers or fractions
  Given I am
  When I fill out the size input with "0.5"
  And I click on the submit button
  Then the "0.5" displayed in the variant box

Scenario: Resize variant with letters
  Given I am 
  When I fill out a variant size input with "abc"
  But I can not type any letters

Scenario: Variant pack unit
  Given I am
  When I fill out the pack unit input with "liter"
  And I click on the submit button
  Then the "liter" displayed in the variant box

Scenario: Variant availability
  Given I am
  When I click on the checkbox next to "Is available"
  Then the edited product is available