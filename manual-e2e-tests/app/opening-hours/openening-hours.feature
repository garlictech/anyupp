Feature: Opening Hours

  Background: Logged in to the app
    Given I am logged into the app

  Scenario: "Read opening hours"

    When I tap the text "Check them all on the map" 
    Then there is the map screen
    When I swipe up the botttom sheet
    Then I there is a list of units
    Then I check if bellow the name of the units there is an opening hour range
    Then I check if the range is formatted in this format: "Opened: XX:XX - YY:YY"
