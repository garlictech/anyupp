Feature: Dashboard

  Background: Login and steps to the dashboard
    # Given I am on the dashboard as an authenticated superUser
    Given I am on the login page
    Then I should see "AnyUPP Admin" sub-header
    When I fill out the input with id "username" with the adminEmail value
    And I fill out the input with id "password" with the adminPassword value
    And I fill out the "Context" input with the superuserContextId id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    Then the "Dashboard" title is displayed

  # Scenario: test
  #   Then I should see "John Doe" text
  #   And the "Dashboard" title is displayed
  #   And I should see "ORDERS ACCEPTED" text
  # And the "Active orders" icon is selected
  # And the "Placed orders" icon is selected

  Scenario: Floormap
    When I click the "floorMapAction" button
    And I click on the #"01" table
    Then the "Table #01" title is displayed
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed
    And I click on the #"01" seat of #"01" table
    Then the "Seat #01/01" title is displayed
    # When I click on "Success" button at the #"000010" order
    # When I click on the text "OK" button
    # When I click on "placed" button at the #"000010" order
    # When I click on "processing" button at the #"000010" order
    # When I click on "ready" button at the #"000010" order
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed
