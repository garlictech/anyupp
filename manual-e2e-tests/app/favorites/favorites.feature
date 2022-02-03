Feature: Favorites in the app

  Background: Login
    Given I am on the login screen
    And the language is set to EN
    When I tap on the "Continue anonymously" text
    Then there is a loading screen
    And I should see the "Unit selector" screen
    When I tap on the "Késdobáló #111" unit in the list
    And I tap on the "In place" button
    Then I should see the "Menu" screen

  Scenario: Add and remove favorite item
    When I tap on the "Sajtburger" card under "Hamburgers" category
    And I should see the "Hearth" icon
    When I tap on the "Hearth" icon
    When I tap on the "close" button
    Then I should see the "Menu" screen
    When I tap on the "Favorites" category
    Then I should see the "Sajtburger" card
    When I tap on the "Sajtburger" card
    Then I should see the "Hearth" icon selected
    When I tap on the "Hearth" icon
    And I tap on the "close" button
    Then I should see "You have not added any favorite items yet."

  Scenario: When a favorite product is available only in inplace
    Given the admin sets "Sajtburger" product to only in place mode
    When I tap on the "Sajtburger" card "Hamburgers" category
    When I tap on the "Hearth" icon
    When I tap on the "close" button
    Then I should see the "Menu" screen
    When I tap on the "Favorites" category
    Then I should see the "Sajtburger" card
    When I tap on the "In place" icon
    Then I should see the "Please select" dialog
    When I tap on the "Take away" button
    Then I should see the "Sajtburger" card
    And I should see the "Only in place" text

