@group @unit @product
Feature: Download the new product

    After we created the new product on Chain, we need to download it.
    At the first time, we have to download on the Group list then, on the
    Unit product list.

Background: Steps to get the new product
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "products" page

Scenario: Check form dialog text
  When I click on the first "download" button
  Then the "Extend product" text is displayed

Scenario: Set the tax and submit
  Given I am on the "group products" list
  When I click on the first "download" button
  And I fill out the "Tax (%)" input with "19"
  And I click on the "submit" button
  Then I should see the product list
  And I should see the new product
  But I should NOT see the "download" button

Scenario: Submit the new product on Unit
  Given I am on the "unit products" list
  When I click on the first "download" button
  And I click on the "submit" button
  Then I should see the product list
  And I should see the new product
  But I should NOT see the "download" button
