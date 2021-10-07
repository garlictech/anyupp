Feature: Apple, Google, Facebook

  Scenario: Apple login
    Given I have an iCloud account
    And I am on the login page
    When I tap the "Apple" logo
    Then I should see "Sign In" text
    Then I should see "Continue" text
    When I tap the "Use a different Apple ID"
    Then I should see a loading screen
    Then I should see "Use your Apple ID to sign in to AnyUpp." text
    When I fill out the "Apple ID" input with ""
    When I fill out the "Password" input with ""
    Then I should see "Do you trust this browser?" text
    When I tap the button "Trust"
    Then I should see "Do you want to continue using anyupp with your apple id email?" text
    When I tap the button "Continue"
    Then I should see the unit selection screen

  Scenario: Google login
    Given I have an Google account
    And I am on the login page
    When I tap the "Google" logo
    Then I should see "Bejelentkezés Google-fiókkal" text
    And I fill out the "Email cím vagy telefonszám" input with ""
    When I tap the button "Következő"
    Then I should see a number
    When I tap on the "Trying to sign in?" message
    Then I should see "Tryin to sign in from another device" text
    When I tap on the "YES"
    And I tap on the number that I got
    Then there is a loading screen
    And I should see the unit selection screen

  Scenario: Facebook login
    Given I have a Facebook account
    And I am on the login page
    When I tap the "Facebook" logo
    And I accept the cookies
    And I fill out the "Mobiltelefonszám vagy e-mail-cím" input with ""
    And I fill out the "Facebook-jelszó" input with ""
    And I tap the "Bejelentkezés" button
    Then I should see the unit selection screen
