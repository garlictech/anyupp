Feature: Favorites in the app

  Background: Login
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen

  Scenario: Add and remove favorite item
    When I tap on the "Sajtburger" card under "Hamburgers" category
    Then I should see the "Hearth" icon
    When I tap on the "Hearth" icon
    And I tap on the "close" button
    Then I should see the "Menu" screen
    When I tap on the "Favorites" category
    Then I should see the "Sajtburger" card
    When I tap on the "Sajtburger" card
    And I tap on the "Hearth" icon
    And I tap on the "close" button
    Then I should see "You haven't added any favorites yet."

  Scenario: When a favorite product is available only in inplace
    Given the admin sets "Sajtburger" product to only in place mode
    When I tap on the "Sajtburger" card "Hamburgers" category
    When I tap on the "Hearth" icon
    When I tap on the "close" button
    Then I should see the "Menu" screen
    When I tap on the "Favorites" category
    Then I should see the "Sajtburger" card
    When I tap on the mode selector button
    And I tap on the "Take away" button
    Then I should see the "Sajtburger" card
    And I should see the "Only in place" text
