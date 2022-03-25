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
    And I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    And the "Dashboard" title is displayed

  Scenario: Dashboard
    Then I should see "testuser+monad" text
    And I should see "Orders accepted" text
    When I click on the "Orders accepted" button
    Then I should see "Confirm" text
    When I click on the "OK" button
    And I wait 1000 ms
    And I click on the "Orders blocked" button
    And I click on the "OK" button
    Then I should see "Orders accepted" text
    When I click the "Manual payments" icon with title
    And I click the "Problematic orders" icon with title
    And I click the "Placed orders" icon with title

  Scenario: Floormap
    When I click the "floorMapAction" button
    And I click on the #"01" table
    Then the "Table #01" title is displayed
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed
    And I click on the #"02" seat of the #"01" table
    Then the "Seat #01/02" title is displayed
    When I click on "placed" button at the first order
    And I wait 1000 ms
    Then I should see the button in "processing"
    When I click on "processing" button at the first order
    And I wait 1000 ms
    Then I should see the button in "ready"
    When I click on "ready" button at the first order
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed

  Scenario: Active orders, placed to served
    When I click the "Placed orders" icon with title
    When I click on the #"000004" order item
    And I click on the print button
    Then I should see the "Késdobáló #111" text
    And I should see the "1021, Budapest Ág u. 1." text
    And I should see the "Table num: 01/02" text
    When I click on the close button
    When I click on "placed" button at the #000004 order
    When I click on "processing" button at the #000004 order
    When I click on "ready" button at the #000004 order
    When I click the "historyOrdersAction" button
    And I wait 1000 ms
    When I click on the #"000004" order item
    Then I should see "served" text

  Scenario: Failed and deleted order
    When I click the "Problematic orders" icon with title
    When I click on the #"000001" order item
    And I click on the "Failed" button
    Then I should see "Failed transaction. Please select unpay category!" text
    When I click on the "Unpay category" button
    And I click on the "Staff meal" option
    And I click on the "OK" button
    And I wait 1000 ms
    When I click on the "Delete order" button
    Then I should see "Are you sure you delete the order?" text
    And I click on the "OK" button
    And I wait 1000 ms
    When I click the "historyOrdersAction" button

  # Scenario: Orders history
  #   When I click the "historyOrdersAction" button
  #   And I click on the date picker

  Scenario: Reports feature
    When I click the "reportsAction" button
    Then I should see "Paid orders" text
    And I should see "Unpay orders" text
    And I should see "Rejected orders" text
    And I should see a "Product mix" table
    When I click on the "List all" button
    And I click on the close button
    When I click on the "Export" button
  # Then the xlsx file is downloaded

  Scenario: Lane view
    When I click the "lanesAction" button
    And I click on the "bár (60/0/0)" checkbox
# And I click on the arrow button on the placed product
# And I click on the arrow button on the processed product
# And I click on the arrow button on the ready product
