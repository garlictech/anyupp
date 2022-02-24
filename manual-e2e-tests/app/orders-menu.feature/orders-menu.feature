Feature: Orders menu feature

  Background: Basic
    Given I am logged in as an anonym user
    And the language is set to EN
    And I am on the "Orders" screen

  Scenario: No active/served orders
    Then I should see "No active order placed yet" dialog
    When I tap on the "Discover menu" button
    Then I should see the "Menu" screen

  Scenario: 1 active order and 1 served order
    Given I have an active order
    And I have an served order
    Then I should see "Current orders" text
    And I should see "Order history" text
    And I should see 2 order cards
    And I should see a red sign on the "Orders" icon
