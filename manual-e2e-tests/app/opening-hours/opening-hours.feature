Feature: Opening Hours

  Background: Login to the app
    Given I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And I should see the "Home" screen

  Scenario: Read opening hours
    #Scenario: Check opening hours from the unit selection screen
    When I swipe left on the unit sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
    When the time is before opening hours it should show "Closed"
    And the time is after opening hours it should show "Closed"
    # Scenario: Check opening hours from the map
    When I tap the text "Check them all on the map"
    Then I should see the "map" screen
    And I should see my location with red marker
    And I should see "Késdobáló #111" unit with green marker
    When I swipe up at the bottom sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
    When the time is before opening hours it should show "Closed"
    And the time is after opening hours it should show "Closed"
