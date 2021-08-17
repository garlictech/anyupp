Feature: Dashboard

  Background: Steps to the dashboard
    When I fill out the input with id "username" with the adminEmail value
    And I fill out the input with id "password" with the adminPassword value
    And I fill out the "Context" input with the superuserContextId id
    And I click the "sign in" text
    Then I should be on the dashboard page
    Then I set the language to EN
    Then I should see "John Doe" text
    And the "Dashboard" title is displayed
    And I should see the "ORDERS ACCEPTED" button
    Then I always should see the "Active orders" tab first

  Scenario: Active orders tab
    Then I should see the "Placed orders" icon with title
    And the "Placed orders" is selected
    And I should see the "Manual payments" icon with title
    And I should see the "Problematic orders" icon with title
    # about the issue #1342
    And I should see at least 100 orders on the "Manual payments" icon
    When I click on the "Manual payments" icon
    Then I should see at least 100 orders as I scrolling down on the list
    And I should see at least 100 orders on the "Problematic orders" icon
    When I click on the "Problematic orders" icon
    Then I should see at least 100 orders as I scrolling down on the list

  Scenario: Get the order to History from Active orders (stripe)
    Given I have an inapp "PLACED" order with 1 product
    When the "Placed orders" icon is selected
    Then I should see an order with an id starts with "#"
    And I should see the time of the created order
    When I click on the order
    Then I should see the deatils of it
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    When I click on the "READY" button next to the product name
    Then I should not see the order on the "Active orders" tab
    When I click on the "Orders history" tab
    Then I should see the paid inapp order

  Scenario: Get the order to History from Active orders (cash/card)
    Given I have a cash/card "NONE" order with 1 product
    When the "Placed orders" icon is selected
    And I click on the "Manual payments" icon with title
    Then I should see an order with an id starts with "#"
    And I should see the time of the created order
    When I click on the order
    Then I should see the deatils of it
    When I click on the "NONE" button next to the product name
    Then I should see the buttons in "PLACED"
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    When I click on the "READY" button next to the product name
    Then I should not see the order on the "Active orders" tab
    When I click on the "Orders history" tab
    Then I should see the paid cash/card order

  Scenario: Floormap status updates
    Given I am on the dashboard page
    When I click to floormap button
    Then I should see the unit floormap
    When I create a cash order
    Then I should see "red" seat with "0201" id on the floormap
    Then I should see "red" border with "0201" id on the floormap
    When I set order status to "placed"
    Then I should see "orange" seat with "0201" id on the floormap
    When I set order status to "processing"
    Then I should see "blue" seat with "0201" id on the floormap
    When I set order status to "ready"
    Then I should see "purple" seat with "0201" id on the floormap
    When I set order status to "served"
    Then I should see "green" seat with "0201" id on the floormap
    When I set order transaction status to "success"
    Then I should see "brown" seat with "0201" id on the floormap
    Then I should see "black" border with "0201" id on the floormap

  Scenario: Order payment failure
    Given I am on the dashboard page
    When I create a cash order
    Then I should see my order on the list
    When I click to the failure button
    Then I should see the unpay modal
    When I select an item from the list
    And I click to the OK button
    Then I should see the red badge with the selected status caption

  Scenario: Order History feature
    When I click on the "Orders history" tab
    Then I shpuld see the paid orders on the left
    And I should see the first selected paid order on the right
    #Scenario: Order print
    # about the #1248 issue
    When I click on the print button
    Then I should see the recipe form
    And I should see the address "1021, Budapest Ág u. 1." of the unit
    When I click on the close button
    Then I should see the "Orders history" page
