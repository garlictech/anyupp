Feature: Inactive products

  Scenario: When the products inactive in a category
    Given the language is set to EN
    And I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    # Then I should see "Allow AnyUpp to access this device's location?" text
    # When I tap the "While using the app" text
    # Android
    # Then I should see "Allow "AnyUpp" to use your location?" text
    # When I tap the "Allow While Using App" text
    # iOS
    And there is the unit selection screen
    When I tap the "Késdobáló #121" unit in the list
    And I tap the "Take away" button
    Then there is the "Menu" screen
    Then I should see "The unit has no products yet." text
    #Scenario: the admin set it back to active
    When I tap the "back arrow" button
    Then I should be on the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
