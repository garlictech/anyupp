Feature: Set the language and switch between in place and takeaway modes

  Scenario: Set the language to HU then set it back to EN
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    # Then I should see "Allow AnyUpp to access this device's location?" text
    # When I tap the "While using the app" text
    # Android
    # Then I should see "Allow "AnyUpp" to use your location?" text
    # When I tap the "Allow While Using App" text
    # iOS
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "Sorry, this product category is not available in in place mode." text
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
    When I tap the "Menu" button
    And I tap the "Take away" icon
    When I tap the "Are you sure you want to switch to takeaway?" text
    And I tap the "Yes" button
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
    When I tap the "Favorites" button
    Then I should see "You have not added any favorite items yet." text
