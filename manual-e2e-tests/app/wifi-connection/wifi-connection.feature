Feature: Handle the wifi connection

  Background: Login
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator

  Scenario: Turn off and on the wifi
    When I turn off the wifi of the phone
    Then I should see the "No internet connection!" text
    When I turn on the wifi of the phone
    Then the app should work as expected
