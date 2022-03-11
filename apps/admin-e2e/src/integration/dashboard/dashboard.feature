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

  Scenario: test
    Then I should see "testuser+monad" text
    And the "Dashboard" title is displayed
    And I should see "ORDERS ACCEPTED" text
  # And the "Active orders" icon is selected
  # And the "Placed orders" icon is selected

  Scenario: Floormap
    When I click the "floorMapAction" button
    And I click on the #"01" table
    Then the "Table #01" title is displayed
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed
    And I click on the #"01" seat of #"02" table
    Then the "Seat #01/02" title is displayed
    When I click on "placed" button at the first order
    Then I should see the button in "processing"
    When I click on "processing" button at the first order
    Then I should see the button in "ready"
    When I click on "ready" button at the first order
    And I click the "closeFloorMapOrders" button
    Then the "Dashboard" title is displayed

  Scenario: Active orders, placed to served
    Then I should see 15 orders on the "Placed orders" icon
    And I should see 20 orders on the "Manual payments" icon
    And I should see 5 orders on the "Problematic orders" icon
    When I click the "Manual payments" icon with title
    Then I should see 7 orders on the list
    When I click the "Problematic orders" icon with title
    Then I should see 5 orders on the list
    When I click the "Placed orders" icon with title
    Then I should see 7 orders on the list
    When I click on the #"000004" order item
    And I click on the print button
    Then I should see the "Késdobáló #111" text
    Then I should see the "1021, Budapest Ág u. 1." text
    Then I should see the "Table num: 01/02" text
    When I click on the close button
  # When I click on "placed" button at the #"000004" order
  # When I click on "processing" button at the #"000004" order
  # When I click on "ready" button at the #"000004" order
  # When I click the "historyOrdersAction" button
  # Then I should see the order in "served"

  Scenario: Failed and deleted order
    When I click the "Manual payments" icon with title
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

  Scenario: Orders history
    When I click the "historyOrdersAction" button
    And I click on the date picker

  Scenario: Reports feature
    When I click the "reportsAction" button
    Then I should see "Paid orders" text
    And I should see "Unpay orders" text
    And I should see "Rejected orders" text
    And I should see a "Product mix" table
    When I click on the "List all" button
    And I click on the close button
    When I click on the "Export" button
# Then the xlsx file is downloaded with the name "Késdobáló #111"

# Scenario: Lane view
#   When I click the "lanesAction" button
#   And I click on the "bár (60/0/0)" checkbox
#   And I click on the arrow button on the placed product
# And I click on the arrow button on the processed product
# And I click on the arrow button on the finished product

# Scenario: about the #1165 issue (failed payment cash/card)
#   When I click the button with title "Manual payments"
#   When I click on the #"000001" order item
#   When I click on "none" button at the #"000001" order
#   When I click on "placed" button at the #"000001" order
#   When I click on "processing" button at the #"000001" order
#   When I click on "Failed" button at the #"000001" order
#   Then I should see "Confirm" text
#   When I click on the "Unpay category" button
#   And I click on the "Manager meal" option
#   When I click on the "OK" button
#   When I click on "ready" button at the #"000001" order
# When the "Placed orders" icon is selected
# And I should see the time of the created order
# When I click on the order with "298 Ft"
# Then I should see the deatils of order
# And I should see "Failed transaction. Please select unpay category!" text
# Then I should see 10 options on the list
# And I click on the "Orders history" tab
# Then I should see the failed order selected
# And I should see the green badge with "failed" caption

# --- not impelemnted ---

# Background: Steps to the dashboard
#   Given I am on the dashboard as an authenticated superUser
#   And I set the language to EN
#   And I select the "Rab lánc #1" chain in the header menu
#   And I select the "Nagy csoport #1" group in the header menu
#   And I select the "Késdobáló #111" unit in the header menu
#   Then I should see "John Doe" text
#   And the "Dashboard" title is displayed
#   And I should see "ORDERS ACCEPTED" text
#   And the "Active orders" icon is selected
#   And the "Placed orders" icon is selected

# Scenario: Get the order to History from Lane view (stripe)
#   Given I create a "Hamburger" cash/card order with "Rice" component
#   And the order is in "PLACED" state
#   Then I should see a 6 number id with "#"
#   And I should see the time of the created order
#   And I should see the price of the order
#   When I click on the order with the id
#   Then I should see the deatils of order
#   Then I should see the green badge with "Success" caption
#   When I click on the "PLACED" button next to the product name
#   Then I should see the buttons in "PROCESSING"
#   When I click on the "Lanes" icon
#   And I click on the "bár" checkbox
#   Then I should see the "Hamburger" in "Processing"
#   And I should see "normal" text
#   And I should see "Room temperature" text
#   When I click on the "Active orders" icon
#   And the "Placed orders" icon is selected
#   When I click on the order with "2982 Ft"
#   When I click on the "PROCESSING" button next to the product name
#   Then I should see the buttons in "READY"
#   When I click on the "READY" button next to the product name
#   Then I should NOT see the order on the "Active orders" tab
#   When I click on the "Orders history" icon with title
#   Then I should see the served order selected
#   Then I should see the "Hamburger (normal)" product with "Room temperature"
#   Then I should see the green badge with "Success" caption
#   When I click on the "Reports" icon with title
#   Then I should see "2982 Ft" on the "Orders amount" card
#   When I scroll down to see the "Product mix"
#   Then there is "Hamburger" product with number "1" in the row
#   When I click on the "LIST ALL" button
#   Then I should see the "Product mix" dialog with the "Hamburger"
#   And I click on the close button

# Scenario: Get the order to History from Lane view (cash/card)
#   Given I create a "Hamburger" cash/card order with "Rice" component
#   And the order is in "NONE" state
#   When I click on the "Manual payments" icon with title
#   And I scroll down to the bottom of the list
#   Then I should see the order selection with dark grey color
#   Then I should see a 6 number id with "#"
#   And I should see the time of the created order
#   And I should see the price of the order
#   When I click on the order with the id
#   Then I should see the deatils of order
#   When I click on the "SUCCESS" button
#   Then I should see a dialog with "Are you sure you set the transaction status to ‘success’?" text
#   When I click on the "OK" button
#   Then I should see the buttons in "PLACED"
#   And I click on the "Placed orders" icon with title
#   When I click on the "PLACED" button next to the product name
#   Then I should see the buttons in "PROCESSING"
#   When I reload the admin page
#   And I click on the order with "2982 Ft"
#   When I click on the "PROCESSING" button next to the product name
#   Then I should see the buttons in "READY"
#   When I click on the "READY" button next to the product name
#   Then I should NOT see the order on the "Active orders" tab
#   When I click on the "Orders history" tab
#   Then I should see the served order selected
#   Then I should see the "Hamburger (normal)" product with "Room temperature"
#   Then I should see the green badge with "Success" caption
#   When I click on the "Reports" icon with title
#   Then I should see "2982 Ft" on the "Orders amount" card
#   When I scroll down to see the "Product mix"
#   Then there is "Hamburger" product with number "1" in the row
#   When I click on the "LIST ALL" button
#   Then I should see the "Product mix" dialog with the "Hamburger"
#   And I click on the close button
#   When I click on the "EXPORT" button
#   Then the xlsx file is downloaded with the name "Késdobáló #111"

# Scenario: Floormap status updates
#   Given I have created a cash/card order
#   When I click on the "Floormap" icon with title
#   Then I should see the unit floormap
#   When I click on the table with number "01"
#   Then I should see all the seeded orders
#   And I should see "red" seat with "0201" id on the floormap
#   Then I should see "red" border with "0201" id on the floormap
#   When I click on the red seat with number "02"
#   When I click on the "NONE" button next to the product name
#   Then I should see the buttons in "PLACED"
#   Then I should see "orange" seat with "0201" id on the floormap
#   When I click on the "PLACED" button next to the product name
#   Then I should see the buttons in "PROCESSING"
#   Then I should see "blue" seat with "0201" id on the floormap
#   When I click on the "PROCESSING" button next to the product name
#   Then I should see the buttons in "READY"
#   Then I should see "purple" seat with "0201" id on the floormap
#   When I click on the "READY" button next to the product name
#   Then I should see "green" seat with "0201" id on the floormap
#   When I click on the "SUCCESS" button
#   Then I should see a dialog with "Are you sure you set the transaction status to ‘success’?" text
#   When I click on the "OK" button
#   Then I should see "brown" seat with "0201" id on the floormap
#   Then I should see "black" border with "0201" id on the floormap

# Scenario: Order payment failure
#   Given I create a cash or card order from the app
#   When I click on the "Manual payments" icon with title
#   Then I should see my order at the bottom on the list
#   When I click on the created order
#   And I click on the "FAILED" button
#   Then I should see the unpay modal
#   And I should see "Failed transaction. Please select unpay category!" text
#   When I click on the "Unpay category" button
#   Then I should see 10 options on the list
#   When I click on the "Staff meal" option
#   And I click on the "OK" button
#   Then I should see the red badge with "Staff meal" caption
#   When I click on the "DELETE ORDER" button
#   Then I should see "Are you sure you delete the order?" text
#   When I click on the "OK" button
#   Then the order is disappeared from the manual payments
#   When I click on the "Orders history" tab
#   Then I should see the first selected and deleted order
#   And I should see the red badge with "Failed (Staff meal)" caption
#   And I should see the red badge with "rejected" caption
#   When I click on the "Reports" tab
#   And I scroll down to see the "Unpay categories"
#   Then I should see a number "1" in the "Staff meal" line
#   And I should see the price "298 Ft"
#   And I should see "1" on the "Unique users" card
#   And I should see "298 Ft" on the "Orders amount" card

# Scenario: Order History feature
#   Given I have a cash/card served order with VAT
#   When I click on the "Orders history" icon with title
#   Then the served orders list is on the left descending by time
#   And the order with VAT is selected on the right
#   When I click on the print button
#   Then I should see "Receipt type: invoice" text
#   And I should see the address "1021, Budapest Ág u. 1." of the unit
#   And I should see the seat id starts with "Table num:"
#   When I click on the close button
#   Then I should see the "Orders history" page
#   And the first served order is selected
#   When I click on the yellow recall button
#   Then I should see "Are you sure you recall the archived order?" text
#   When I click on the "OK" button
#   Then I should NOT see the served order in "Orders History"
#   When I click on the "Active orders" icon with title
#   Then the "Placed orders" icon is selected
#   When I click on the order with purple color
#   Then I should see the product in "SERVED"
#   And I should see the order in "READY"
#   When I click on the "READY" button
#   And I should see the order in "SERVED"
#   When I click on the "SUCCESS" button
#   Then I should see a dialog with "Are you sure you set the transaction status to ‘success’?" text
#   When I click on the "OK" button
#   Then I should NOT see the order on the "Active orders" tab
