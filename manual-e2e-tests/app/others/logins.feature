Feature: Login, sign up, log out

  Anonymous, Apple, Google, Facebook, mail

  Background: Basic
    Given I am on the login page
    And the app language is set to EN
    Then I should see "AnyUpp" text

  Scenario: Anonymous login, logout from unit selector screen
    When I tap on the "Continue anonymously" option
    Then I should see the "Home" screen
    Then I should see "Welcome AnonymUser!" text
    When I tap on the "logout" button
    Then I should see "Confirm Logout" dialog
    Then I should see "Are you sure you want to log out?" text
    When I tap on the "Logout" button
    Then I should see the "Login" screen
  #jobb felso sarok

  Scenario: Mail sign up and sign in
    #sign up
    Given I have some type of mail account
    When I tap on the "Mail" logo
    And I tap on the "Sign up..." text
    When I fill out the "Email" input with "email"
    When I fill out the "Password" input with "pw"
    When I fill out the "Password again" input with "pw"
    When I tap on the "Sign up" button
    Then I should see "We have sent the activation email" text
    When I tap on the "Sign in" text
    #outside of the app
    When I go to my emails
    And I verify my email for registration
    And I go back to AnyUpp app
    #sign in
    And I fill out the "Email" input with "email"
    And I fill out the "Password" input with "pw"
    And I tap on the "Login" button
    Then I should see the "Home" screen
    When I select a unit from the list
    And I tap on the "Profile" button
    And I tap on the "Logout" button
    Then I should see "Confirm Logout" dialog
    When I tap on the "Logout" button
    Then I should see the "Login" screen
    #reset password
    When I tap on the "Mail" logo
    And I tap on the "Forgot password..." text
    And I fill out the "Email" input with "email"
    And I tap on the "Reset my password" button
    Then I should see the "Code sent" text
    And I tap on the "Enter code" text
    #outside of the app
    When I go to my emails
    And I copy my pw for password reset
    And I go back to AnyUpp app
    When I fill out the "Verification code" input with numbers
    When I fill out the "Password" input with "pw"
    When I fill out the "Password again" input with "pw"
    And I tap on the "Reset my password" button
    Then I should see the "Password updated" text
    #sign in with the new pw
    And I tap on the "Sign in" text
    And I fill out the "Email" input with "email"
    And I fill out the "Password" input with "pw"
    And I tap on the "Login" button
    Then I should see the "Home" screen

  #we cannot test the apple, google, or fb logins right now (2022. 02. 23.)

  Scenario: Apple login
    Given I have an iCloud account
    When I tap on the "Apple" logo
    Then I should see "Sign In" text
    Then I should see "Continue" text
    When I tap on the "Use a different Apple ID"
    Then I should see a loading screen
    Then I should see "Use your Apple ID to sign in to AnyUpp." text
    When I fill out the "Apple ID" input with ""
    When I fill out the "Password" input with ""
    Then I should see "Do you trust this browser?" text
    When I tap on the button "Trust"
    Then I should see "Do you want to continue using anyupp with your apple id email?" text
    When I tap on the button "Continue"
    Then I should see the "Home" screen

  Scenario: Google login
    Given I have a Google account
    When I tap on the "Google" logo
    Then I should see "Bejelentkezés Google-fiókkal" text
    And I fill out the "Email cím vagy telefonszám" input with ""
    When I tap on the button "Következő"
    Then I should see a number
    When I tap on the "Trying to sign in?" message
    Then I should see "Tryin to sign in from another device" text
    When I tap on the "YES"
    And I tap on the number that I got
    Then there is a loading screen
    Then I should see the "Home" screen

  Scenario: Facebook login
    Given I have a Facebook account
    When I tap on the "Facebook" logo
    And I accept the cookies
    And I fill out the "Mobiltelefonszám vagy e-mail-cím" input with ""
    And I fill out the "Facebook-jelszó" input with ""
    And I tap on the "Bejelentkezés" button
    Then I should see the "Home" screen
