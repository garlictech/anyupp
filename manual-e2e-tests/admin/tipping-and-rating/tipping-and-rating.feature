Feature: Tipping and rating feature on admin

  Background: Login
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #112" unit in the header menu

  Scenario: Tipping and rating policy of a Unit
    When I click on the menu icon
    And I click on the "Units" text
    When I click the edit button in the listitem with "Késdobáló #112" content
    Then I should see "Rating policies" text
    When I click on the "Rating policy" button
    When I click on the "How do you rate your overall experience?" option
    When I click on the "Add" button
    When I click on the "Rating policy" button
    When I click on the "How do you rate the speed of our service?" option
    When I click on the "Add" button
    # When I delete the "How do you rate the speed of our service?" option
    Then I should see "Tips" text
    When I fill out the "Title (HU)" input with "tip name HU e2e"
    When I fill out the "Title (EN)" input with "tip name EN e2e"
    When I fill out the "Title (DE)" input with "tip name DE e2e"
    When I fill out the "Description (HU)" input with "tip description HU e2e"
    When I fill out the "Description (EN)" input with "tip description EN e2e"
    When I fill out the "Description (DE)" input with "tip description DE e2e"
    # When I fill out "newPercent" input with "10"
    # When I click on the plus button
    # When I set the tipping policy
    # When I fill out "maxOtherAmount" input with "5000"
    When I click on the "Submit" button

  Scenario: Tipping on Daily report
    When I click the "reportsAction" button
    Then I should see "the sum of tips" text
#it's still not available on admin
