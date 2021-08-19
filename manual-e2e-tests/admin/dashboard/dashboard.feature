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
    Given I have a cash/card "NONE" order with 1 "Fanta #2" product
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
    Then I should see the green badge with "Success" caption
    And I should see the green badge with "served" caption
    When I click on the "Reports" tab
    Then I should see "298 Ft" on the "Orders amount" card
    When I scroll down to see the "Product mix"
    Then I should see the "Fanta #2" product with the number "1"
    When I click on the "LIST ALL" button
    Then I should see the "Product mix" dialog with the "Fanta #2"
    And I click on the close button


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
    Given I create a cash or card order from the app
    When I click on the "Manual payments" icon with title
    Then I should see my order at the bottom on the list
    When I click on the created order
    And I click on the "FAILED" button
    Then I should see the unpay modal
    And I should see "Failed transaction. Please select unpay category!" text
    When I click on the "Unpay category" button
    Then I should see 10 options on the list
    When I click on the "Staff meal" option
    And I click on the "OK" button
    Then I should see the red badge with "Staff meal" caption
    When I click on the "DELETE ORDER" button
    Then I should see "Are you sure you delete the order?" text
    When I click on the "OK" button
    Then the order is disappeared from the manual payments
    When I click on the "Orders history" tab
    Then I should see the first selected and deleted order
    And I should see the red badge with "Failed (Staff meal)" caption
    And I should see the red badge with "rejected" caption
    When I click on the "Reports" tab
    And I scroll down to see the "Unpay categories"
    Then I should see a number "1" in the "Staff meal" line
    And I should see the price "298 Ft"
    And I should see "1" on the "Unique users" card
    And I should see "298 Ft" on the "Orders amount" card

  Scenario: Order History feature
    When I click on the "Orders history" tab
    Then I should see the paid orders on the left
    And I should see the first selected paid order on the right
    And I should see the orders descending by date/time
    #Scenario: Order print
    When I click on the print button
    Then I should see the recipe form
    And I should see the address "1021, Budapest Ág u. 1." of the unit
    When I click on the close button
    Then I should see the "Orders history" page

#  Scenario: Reports feature
#    When I click on the "Reports" icon with title
#    Then I should see "Paid orders" text
#    Then I should see "Unpaid orders" text
#    When I scroll down to the bottom of the page
#    Then I should see "Rejected orders" text
# Is it necessary?
