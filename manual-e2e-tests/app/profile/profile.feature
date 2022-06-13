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

  Scenario: Purchases
    Given I have 3 order histories at unit "Késdobáló #111"
    And I should see "Purchases" text
    When I tap the "Purchases" button
    Then I should see the "Purchases" screen
    And I check if there are 3 listed orders
    And I check if the date of the cards are in descending order from top to down

  Scenario: Saved cards
    When I tap on the "Saved cards" button
    And I tap on the "Add new card" highlighted text
    Then I should see the "Add new card" popup with a form
    When I fill out the input with id "xxxx xxxx xxxx xxxx" with "4242 4242 4242 4242"
    And I fill out the input with id "MM/YY" with "01/23" date
    And I fill out the "CVV" input with the "258"
    And I tap the button "SAVE CARD"
    Then I should see "Succes! Card added successfully!" popup
    When I tap on the "OK" button
    Then I should see "visa **** 4242" card is added
    When I swipe left the "visa **** 4242" card
    Then I should see the delete icon
    When I tap on the delete icon
    Then I should see "Delete credit card?" dialod
    When I tap on the "Ok" button
    Then I should not see any added card

  Scenario: Allergens info
    And I should see "Allergens" text
    When I tap on the "Allergens" button
    Then I should see the "ALLERGENS" screen
    And I should see 14 diiferent icons
    And I should see a description

  Scenario: Profile info
    When i tap on the "Profile info" button
    Then I should see the "PROFILE" screen
    And I should see "AnonymUser" text
    And I should see "anonymuser@anyupp.com" text
    And I should see a random 6 digit numbers and letters

  Scenario: Language
    #Set the language to HU then set it back to EN
    Then I should see "Language" text
    When I tap the "Language" button
    And I tap the "Hungarian" tab
    And I tap the "SET LANGUAGE" button
    Then I should see the "Profil" screen
    And I should see the tabs in HU language
    When I tap the "Nyelv" tab
    And I tap the "Angol" tab
    And I tap the "MÓDOSÍTÁSOK MENTÉSE" button
    Then I should see the "Profile" screen
    And I should see the tabs in EN language

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
    Then I should see "Confirm Logout Do you really want to logout?" dialog
    When I tap on the "Log out" button
    Then I should see the "Login" screen
