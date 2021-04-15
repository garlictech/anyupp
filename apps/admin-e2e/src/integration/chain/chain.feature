# Feature: Create a new Chain

#  Background: Steps to the Chain page
#    Given I am on the login page
#    When I fill out the input with id "username" with the "test@anyupp.com" value
#    And I fill out the input with id "password" with the "Testtesttest12_" value
#    And I click the "sign in" text
#    When I click the "skip" text
#    Then I should be on the dashboard page
#    And the "Dashboard" title is displayed

#  Scenario: Check form page
#    When I click on the "menu" icon
#    And I click on the "chains" icon
#    Then the "Chains" title is displayed

#  Scenario: Check form page
#    When I click on the plus button
#    Then the "New Chain" title is displayed
#    When I click on the "close" button
#    Then the "chains" page is displayed

#  Scenario: Active Chain
#    When I click on the "Active" checkbox
#    And I click on the "submit" button
#    Then the "chains" page is displayed
#    When I click on the same product
#    Then I should see the checkbox checked

#  Scenario Outline: Fill out the several type of text inputs
#    When I fill out the "<text>" input with "<name>"
#    And I click on the "submit" button
#    Then I should see the chain with datas

#    Examples:
#        | text             | name     |
#        | Name             | Value 1  |
#        | Description (EN) | Value 2  |
#        | Email            | Value 3  |
#        | Phone            | Value 4  |
#        | Country          | Value 5  |
#        | Postal code      | Value 6  |
#        | City             | Value 7  |
#        | Address          | Value 8  |

#  Scenario Outline: Pick the colors
#    When I click on the "<name>" input
#    And I fill out with "<color>"
#    And I click on the "submit" button
#    Then I should see the chain
#    When I click on the same chain
#    Then I should see the picked colors

#    Examples: 
#        | name               | color   |
#        | Background (light) | #ffffff |
#        | Background (dark)  | #ffffff |
#        | Text (light)       | #ffffff |
#        | Text (dark)        | #ffffff |
