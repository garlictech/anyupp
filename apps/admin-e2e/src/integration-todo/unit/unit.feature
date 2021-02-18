@unit @create @edit
Feature: Create or Update Unit

    Unit

Background: Steps to the Units page
  Given I am logged in as an admin user
  And I am at the "english" language
  And I am at the "chains" page

Scenario Outline: Fill out the name and description
  When I click on the "<text>" input
  And I fill out with "<input>"
  And I click on the "submit" button

  Examples:
      | text             | input           |
      | Name (EN)        | new product     |
      | Description (EN) | new description |

Scenario Outline: Checkboxes
  When I click on the "checkbox" next to "<text>"
  And I click on the "submit" button
  Then I should see the product list
  When I click on the same product
  Then I should see the "checkbox" checked

  Examples:
      | text   |
      | Active |
      | Cash   |
      | Card   |
      | Simple Pay |

Scenario: Calendar


Scenario: Set the Opening hours
  Given I am at the "<day>" lane
  And the lane has two inputs
  When I click on the input next to "<day>"
  And I fill out with "<time 1>"
  And I fill out the "<time 2>"
  And I click on the "submit" button
  Then I should see the Units page
  When I click on the same Unit
  Then I should see the Opening hours filled


Scenario: Lanes