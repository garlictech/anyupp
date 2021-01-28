@product @group @edit @variant
Feature: Edit Group product

    Description

Background:
  Given I am logged in
  And I am at the "english" language
  And I am at the "Products" page
  And I am at the "Group products" tab
  And I am on the first "Edit" button
  When I click on the Edit button
  Then the "Edit product" title displayed
  And the "Variants" title displayed

Scenario: Inputs and dialogs
  Given Start to type your Given step here

Scenario: Group basic
  Given 
  And the "Basic info" title displayed
  When I fill out the Tax input with "20"
  And I click on the checkbox next to the "Is visible"
  And I click on the submit button
  Then the "20" tax percent is valid and is visible

Scenario: Group variant price
  Given 
  When I fill out the Price input with "700"
  And I click on the submit button
  Then the "700" displayed in the variant box

Scenario: Variant type
  Given 
  When I click on the Type dropdown menu
  And I click on the "Always" option
  And I click on the submit button
  Then the type of the variant is "Always"

Scenario: Add variant availability
  Given 
  When I click on the "Add availability" button
  And I click on the "Type" dropdown menu
  And I click on the "Weekly" option
  Then the "Day from" and "Day to" and "Time from" and "Time to" titles displayed
  When I fill out the Price input with "400"
  Then the Price input is "400"
  When I click on the "Day from" dropdown menu
  And I click on "Monday"
  Then the "Monday" displayed
  When I click on the "Day to" dropdown menu
  And I click on "Wednesday"
  Then the "Wednesday" displayed
  When I click on the "Time from" input
  And I fill out with "11:00"
  Then the "11:00" displayed
  When I click on the "Time to" input
  And I fill out with "13:00"
  Then the "13:00" displayed
  When I click on the Submit button
  Then the Group product availability dislayed in the variant box
