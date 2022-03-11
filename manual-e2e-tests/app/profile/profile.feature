Feature: The whole Profile menu

  Background: Basic, in the Késdobáló #111
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Menu" screen
    When I tap on the "Profile" button
    Then I should see "AnonymUser" text
    And I should see "Account" text
    And I should see "Settings" text
    And I should see "Logout" text

  Scenario: Transactions
    Given I have 3 order histories at unit "Késdobáló #111"
    And I should see "Transactions" text
    When I tap the "Transactions" button
    Then I should see the "Transactions" screen
    And I check if there are 3 listed orders
    And I check if the date of the cards are in descending order from top to down

  Scenario: Saved cards

  Scenario: Allergens info
    And I should see "Allergens" text
    When I tap on the "Allergens" button
    Then I should see the "ALLERGENS" screen
    And I should see 14 diiferent icons
    And I should see a description

  Scenario: Language
    #Set the language to HU then set it back to EN
    Then I should see "Language" text
    When I tap the "Language" button
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

  Scenario: Terms of Use info
    Then I should see "Terms of Use" text
    When I tap on the "Terms of Use" button
    And the app opens the "anyupp.com" webpage
    Then I should see "A CyBERG Corp. Nyrt. adatkezelési tájékoztatója" text
    And I should see a long description

  Scenario: About info
    And I should see "About" text
    When I tap on the "About" button
    Then I should see "AnyUpp" text
    And I should see a long description
    When I tap on the back arrow
    Then I should see the "Profile" screen

  Scenario: Log out from Profile
    And I sould see 2 "Logout" text
    When i tap on the "Logout" button
    Then I should see "Confirm Logout Are you sure to want to logout?" dialog
    When I tap on the "Logout" button
    Then I should see the "Login" screen
