@create @edit @chain
Feature: Create a new Chain

    Create or update your Chain with a name and description. Give a whole contact for it. 
    Pick an adress on the map. Lately, create the style of your Chain. Give it some 
    colors, logo and header.

Background: Steps to the New Chain page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "chains" page

Scenario Outline: Check form page
  When I click on the first "<button>" button
  Then the "<title>" title is displayed
  When I click on the "submit" button
  Then the "chains" page is displayed
  And the "<title>" title is hidden

  Examples:
      | button | title      |
      | Edit   | Edit Chain |
      | Plus   | New Chain  |

Scenario: Active Chain
  When I click on the "Active" checkbox
  And I click on the "submit" button
  Then the "chains" page is displayed
  When I lcik on the same product
  Then I should see the checkbox checked

Scenario Outline: Fill out the several type of text inputs
  When I click on the "<text>" input
  And I fill out with "<name>"
  And I click on the "submit" button
  Then I should see the chain with datas

  Examples:
      | text             | name     |
      | Name             | Value 1  |
      | Description (EN) | Value 2  |
      | Email            | Value 3  |
      | Phone            | Value 4  |
      | Country          | Value 5  |
      | Postal code      | Value 6  |
      | City             | Value 7  |
      | Address          | Value 8  |

Scenario Outline: Pick the colors
  When I click on the "<name>" input
  And I fill out with "<color>"
  And I click on the "submit" button
  Then I should see the chain
  When I click on the same chain
  Then I should see the picked colors

  Examples: 
      | name               | color   |
      | Background (light) | #ffffff |
      | Background (dark)  | #ffffff |
      | Text (light)       | #ffffff |
      | Text (dark)        | #ffffff |
