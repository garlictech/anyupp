Feature: Admin language

    Pick one of the 3 languages at the header. 

Scenario: Set the hu language
  Given I am on the dashboard page
  And the language is set for "EN"
  When I click on the "en" selector button
  And I click on the "hungarian" button
  Then the language is "HU"
  And I should see "Vezérlőpult" text

Scenario: Set the EN language again
  Given I am on the dashboard page
  And the language is set for "HU"
  When I click on the "hu" selector button
  And I click on the "english" button
  Then the language is "EN"
  And I should see "Dashboard" text