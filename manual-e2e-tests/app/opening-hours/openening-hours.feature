Feature: Opening Hours

  Background: Login to the app
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen

  Scenario: Read opening hours in EN
    Given the language is set to EN
    #Scenario: Check opening hours from the unit selection screen
    When I swipe left on the unit sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
    When the time is before opening hours it should show "Closed"
    And the time is after opening hours it should show "Closed"
    # Scenario: Check opening hours from the map
    When I tap the text "Check them all on the map"
    Then there is the map screen
    When I swipe up at the botttom sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
    When the time is before opening hours it should show "Closed"
    And the time is after opening hours it should show "Closed"
    # Scenario: Check opening hours from the menu
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator
    When I tap the map icon on top right
    Then I should see the "Current location"
    And I should see "Késdobáló #111" with the address
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
    When the time is before opening hours it should show "Closed"
    And the time is after opening hours it should show "Closed"

  Scenario: Read opening hours in HU
    Given the language is set to HU
    #Scenario: Check opening hours from the unit selection screen
    When I swipe left on the unit sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Nyitva: XX:XX - YY:YY"
    When the time is before opening hours it should show "Zárva"
    And the time is after opening hours it should show "Zárva"
    # Scenario: Check opening hours from the map
    When I tap the text "Térkép használata"
    Then there is the map screen
    When I swipe up at the botttom sheet
    Then I should see the list of units
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Nyitva: XX:XX - YY:YY"
    When the time is before opening hours it should show "Zárva"
    And the time is after opening hours it should show "Zárva"
    # Scenario: Check opening hours from the menu
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menü" option is selected on the bottom navigator
    When I tap the map icon on top right
    Then I should see the "Jelenlegi helyed"
    And I should see "Késdobáló #111" with the address
    And I check if below the name of the units there is an opening hour range
    And I check if the range is formatted in this format: "Nyitva: XX:XX - YY:YY"
    When the time is before opening hours it should show "Zárva"
    And the time is after opening hours it should show "Zárva"
