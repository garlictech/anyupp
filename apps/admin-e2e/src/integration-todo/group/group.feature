@create @edit @group
Feature: Create/update Group

    Create or update your Group with a name and description. Give a whole contact for it. 
    Pick an adress on the map.

Background: Steps to the New Group page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "groups" page

Scenario Outline: Create or edit
  When I click on the "<button>" button
  Then the "<title>" title is displayed
  When I click on the "submit" button
  Then the "chains" page is displayed
  And the "<title>" title is hidden

  Examples:
      | button | title      |
      | Edit   | Edit Chain |
      | Plus   | New Chain  |

Scenario Outline: Currency and Chain
  When I click on the "<name>" selector
  And I click on the "<data>"
  And I click on the "submit" button

  Examples:
      | name     | data             |
      | Chain    | CYBERG Corp Nyrt |
      | Chain    | name             |
      | Currency | EUR              |
      | Currency | HUF              |

Scenario Outline: Fill out the several type of text inputs
  When I click on the "<text>" input
  And I fill out with "<name>"
  And I click on the "submit" button
  Then I should see the group with datas
  
  Examples:
      | text             | name    |
      | Name             | Value 1 |
      | Description (EN) | Value 2 |
      | Email            | Value 3 |
      | Phone            | Value 4 |
      | Country          | Value 5 |
      | Postal code      | Value 6 |
      | City             | Value 7 |
      | Address          | Value 8 |

Scenario: Locate on map
#?