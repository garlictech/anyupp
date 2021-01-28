@product @unit @edit @variant
Feature: Edit Unit product

    Description

Background:
  Given I am logged in
  And I am at the "english" language
  And I am at the "Products" page
  And I am at the "Unit products" tab
  And I am on the first "Edit" button

Scenario: Product basic info 
  Given I am
  And the "Basic info" title displayed
  And name of the product displayed
  When I click on the dropdown menu below the "Lane" title
  And I click on the "Pult" option
  And I click on the checkbox next to the "Is visible"
  And I click on the "Submit" button
  Then the Product is on the "Pult" lane 
  And the  Product is visible

Scenario: Variant datas
  Given I am
  And the "Variants" title displayed
  When I fill out the "Variant name" input with "Csirke leves"
  And I fill out the "Pack size" with "1"
  And I fill out the "Pack unit" with "liter"
  And I click on the "Is visible" checkbox
  And I click ont he "Submit" button
  Then the Variant displayed in the variant box

Scenario: Add variant availability
  Given I am
  And the "Variants" title displayed
  When I click on the "Add availability" button
  Then the new Product Availability displayed

Scenario: Variant Always type
  Given I am
  And the "Variants" title displayed
  When I click on the Type dropdown menu
  And I click on the "Always" option
  And I click on the "Submit" button
  Then the variant type is "Always"
  And the Always availability displayed in the variant box

Scenario: Variant Weekly type
  Given I am
  And the "Variants" title displayed
  When I click on the "Add availability" button
  And I click on the "Type" dropdown menu
  And I click on the "Weekly" option
  Then the "Day from" 
  And "Day to" 
  And "Time from" 
  And "Time to" titles displayed
  When I fill out the Price input with "400"
  And I click on the "Day from" dropdown menu
  And I click on "Monday"
  And I click on the "Day to" dropdown menu
  And I click on "Wednesday"
  And I click on the "Time from" input
  And I fill out with "11:00"
  And I click on the "Time to" input
  And I fill out with "13:00"
  And I click on the "Submit" button
  Then the first list item contains Weekly variant

Scenario: Variant Seasonal type
  Given I am
  And the "Variants" title displayed
  When I click on the "Add availability" button
  And I click on the "Type" dropdown menu
  And I click on the "Seasonal" option
  Then the "Day from" 
  And the "Day to" 
  And the "Time from" 
  And the "Time to" titles displayed
  When I fill out the Price input with "400"
  And I click on the Calendar button below the "Day from" title
  And I click on the "01/01/2020"
  And I click on the Calendar button below the "Day to" title
  And I click on the "01/30/2020" date
  And I click on the "Time from" input
  And I fill out with "13:00"
  And I click on the "Time to" input
  And I fill out with "16:00"
  And I click on the "Submit" button
  Then the first list item contains Seasonal variant
