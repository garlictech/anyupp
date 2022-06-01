Feature: Login, sign up, log out

  Anonymous, Apple, Google, Facebook, mail

  Background: Basic
    Given I am on the login page
    And the app language is set to EN
    Then I should see "AnyUpp" text

  Scenario: Anonymous login, logout from unit selector screen
    When I tap on the "Sign in without register" option
    Then I should see the "Home" screen
    Then I should see "Welcome AnonymUser!" text
    When I tap on the "logout" button
    Then I should see "Confirm Logout" dialog
    Then I should see "Do you really want to log out?" text
    When I tap on the "Log out" button
    Then I should see the "Login" screen
  #jobb felso sarok

  Scenario: Mail sign up and sign in
    #sign up
    Given I have some type of mail account
    When I tap on the "Mail" logo
    And I tap on the "Register..." text
    When I fill out the "Email" input with "email"
    When I fill out the "Password" input with "pw"
    When I fill out the "Password again" input with "pw"
    When I tap on the "Register" button
    Then I should see "We sent the activation link to your email" text
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
    When I tap on the "Log out" button
    Then I should see the "Login" screen
    #reset password
    When I tap on the "Mail" logo
    And I tap on the "I forgot my password." text
    And I fill out the "Email" input with "email"
    And I tap on the "Reset password" button
    Then I should see the "Code sent" text
    And I tap on the "Please enter the activation code" text
    #outside of the app
    When I go to my emails
    And I copy my pw for password reset
    And I go back to AnyUpp app
    When I fill out the "Activation code" input with numbers
    When I fill out the "Password" input with "pw"
    When I fill out the "Password again" input with "pw"
    And I tap on the "Reset password" button
    Then I should see the "Password changed successfully" text
    #sign in with the new pw
    And I tap on the "Sign in" text
    And I fill out the "Email" input with "email"
    And I fill out the "Password" input with "pw"
    And I tap on the "Login" button
    Then I should see the "Home" screen

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
    Then I should see "Trust this browser?" text
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
    And I fill out the "Adja meg jelszavát" input with ""
    When I tap on the button "Következő"
    Then I should see a loading screen
    Then I should see the "Home" screen

  Scenario: Facebook login
    Given I have a Facebook account
    When I tap on the "Facebook" logo
    And I accept the cookies
    Then I should see "Log into your Facebook account to connect AnyUpp Login"
    And I fill out the "Mobile number or email" input with ""
    And I fill out the "Facebook Passwod" input with ""
    And I tap on the "Log in" button
    Then I should see the "Home" screen
