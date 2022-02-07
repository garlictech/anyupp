Feature: Set the language and switch between in place and takeaway modes

  Scenario: Set the language to HU then set it back to EN
    Given I am on the login screen
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    And I tap the "In place" button
    Then there is the "Menu" screen
    When I tap the "You can switch between ordering methods at any time." text
    Then I should see "Hamburgers" product category
    When I tap the "Profile" button
    Then I should see the "Language" tab
    When I tap the "Language" tab
    And I tap the "Magyar" tab
    And I tap the "SET LANGUAGE" button
    Then I should see the "Profil" screen
    And I should see the tabs in HU language
    When I tap the "Nyelv" tab
    And I tap the "English" tab
    And I tap the "MÓDOSÍTÁSOK MENTÉSE" button
    Then I should see the "Profile" screen
    And I should see the tabs in EN language
    When I tap the "Menu" button
    And I tap the "Mode selector" button
    When I tap the "Are you sure you want to switch to takeaway?" text
    And I tap the "Yes" button
    Then I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    When I tap the "Favorites" button
    Then I should see "You have not added any favorite items yet." text

