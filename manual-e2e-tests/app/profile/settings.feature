Feature: Set the language

  Background: Login
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen

  Scenario: Set the language to HU then set it back to EN
    When I tap the "Profile" button
    Then I should see the "Settings" tab
    When I tap the "Settings" tab
    And I tap the "Language" tab
    And I tap the "Hungarian" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in HU language
    When I tap the "Beállítások" tab
    And I tap the "Nyelv" tab
    And I tap the "English" tab
    And I tap the back arrow 2 times
    Then I should see the tabs in EN language
