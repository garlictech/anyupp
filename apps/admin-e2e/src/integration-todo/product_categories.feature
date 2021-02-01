@product @category @edit @add
Feature: Product categories

    It can be tested if there is any category

Background: 
  Given I am logged in
  And I am at the "english" language
  And I am at the "Product categories" page

Scenario: Add category
  Given I am at the Product categories
  And I am at the HU language
  When I click on the Plus button next to the "Termék kategóriák"
  Then the "Új kategória" title displayed
  And the "Név" and the "Leírás" titles displayed
  When I fill out the Name input with "Levesek"
  And I fill out the Description input with "xyz"
  And I click on the Submit button
  Then the "Levesek" category displayed

Scenario: Edit category
  Given I am at the Product categories
  And I am at the HU language
  When I click on the Edit button
  Then the "Termék szerkesztése" title displayed
  And the "Név" and the "Leírás" titles displayed
  When I fill out the Name input with "Levesek"
  And I fill out the Description input with "xyz"
  And I click on the Submit button
  Then the "Levesek" and the "xyz" displayed

Scenario: Change order category
  Given I am at the Product categories
  When I click on the Plus button next to the "Termék kategóriák"
