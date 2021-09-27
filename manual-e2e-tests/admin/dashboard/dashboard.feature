Feature: Dashboard

  Background: Steps to the dashboard
    Given I am on the dashboard as an authenticated superUser
    And I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    Then I should see "John Doe" text
    And the "Dashboard" title is displayed
    And I should see "ORDERS ACCEPTED" text
    And the "Active orders" icon is selected
    And the "Placed orders" icon is selected

  Scenario: Active orders
    Then I should see the "Manual payments" icon with title
    And I should see the "Problematic orders" icon with title
    And I should see at least 20 orders on the "Manual payments" icon
    When I click on the "Manual payments" icon
    Then I should see at least 20 orders as I scrolling down on the list
    And I should see at least 20 orders on the "Problematic orders" icon
    When I click on the "Problematic orders" icon
    Then I should see at least 20 orders as I scrolling up on the list

  Scenario: Get the order to History from Active orders (stripe)
    Given I have an inapp "PLACED" order with 1 "Hamburger #1" product
    Then I should see the order id starts with "#"
    And I should see the time of the created order
    When I click on the order with "148 Ft"
    Then I should see the deatils of order
    Then I should see the green badge with "Success" caption
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    When I click on the "READY" button next to the product name
    Then I should NOT see the order on the "Active orders" tab
    When I click on the "Orders history" icon with title
    Then I should see the served order selected
    Then I should see the "Hamburger #1 (glass)" product with "ROOM TEMPERATURE"
    Then I should see the green badge with "Success" caption
    When I click on the "Reports" icon with title
    Then I should see "148 Ft" on the "Orders amount" card
    When I scroll down to see the "Product mix"
    Then there is "Hamburger #1" product with number "1" in the row
    When I click on the "LIST ALL" button
    Then I should see the "Product mix" dialog with the "Hamburger #1"
    And I click on the close button

  Scenario: Get the order to History from Active orders (cash/card)
    Given I have a cash/card "NONE" order with 1 "Fanta #2" product
    When I click on the "Manual payments" icon with title
    And I scroll down on the list
    Then I should see the order selection with dark grey color
    Then I should see an order with an id starts with "#"
    And I should see the time of the created order
    When I click on the order with "298 Ft"
    Then I should see the deatils of order
    When I click on the "SUCCESS" button
    Then I should see a dialog with "Are you sure you set the transaction status to 'success'?" text
    When I click on the "OK" button
    Then I should see the buttons in "PLACED"
    And I click on the "Placed orders" icon with title
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    When I reload the admin page
    And I click on the order with "298 Ft"
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    When I click on the "READY" button next to the product name
    Then I should NOT see the order on the "Active orders" tab
    When I click on the "Orders history" tab
    Then I should see the served order selected
    Then I should see the "Fanta #2 (glass)" product with "ROOM TEMPERATURE"
    Then I should see the green badge with "Success" caption
    When I click on the "Reports" icon with title
    Then I should see "298 Ft" on the "Orders amount" card
    When I scroll down to see the "Product mix"
    Then there is "Fanta #2" product with number "1" in the row
    When I click on the "LIST ALL" button
    Then I should see the "Product mix" dialog with the "Fanta #2"
    And I click on the close button
    When I click on the "EXPORT" button
    Then the xlsx file is downloaded with the name "Késdobáló #111"

  Scenario: Floormap status updates
    Given I have created a cash/card order
    When I click on the "Floormap" icon with title
    Then I should see the unit floormap
    When I click on the table with number "01"
    Then I should see all the seeded orders
    And I should see "red" seat with "0201" id on the floormap
    Then I should see "red" border with "0201" id on the floormap
    When I click on the red seat with number "02"
    When I click on the "NONE" button next to the product name
    Then I should see the buttons in "PLACED"
    Then I should see "orange" seat with "0201" id on the floormap
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    Then I should see "blue" seat with "0201" id on the floormap
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    Then I should see "purple" seat with "0201" id on the floormap
    When I click on the "READY" button next to the product name
    Then I should see "green" seat with "0201" id on the floormap
    When I click on the "SUCCESS" button
    Then I should see a dialog with "Are you sure you set the transaction status to 'success'?" text
    When I click on the "OK" button
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
    Given I have a cash/card served order with VAT
    When I click on the "Orders history" icon with title
    Then the served orders list is on the left descending by time
    And the order with VAT is selected on the right
    When I click on the print button
    Then I should see "Receipt type: invoice" text
    And I should see the address "1021, Budapest Ág u. 1." of the unit
    And I should see the seat id starts with "Table num:"
    When I click on the close button
    Then I should see the "Orders history" page
    And the first served order is selected
    When I click on the yellow recall button
    Then I should see "Are you sure you recall the archived order?" text
    When I click on the "OK" button
    Then I should NOT see the served order in "Orders History"
    When I click on the "Active orders" icon with title
    Then the "Placed orders" icon is selected
    When I click on the order with purple color
    Then I should see the product in "SERVED"
    And I should see the order in "READY"
    When I click on the "READY" button
    And I should see the order in "SERVED"
    When I click on the "SUCCESS" button
    Then I should see a dialog with "Are you sure you set the transaction status to 'success'?" text
    When I click on the "OK" button
    Then I should NOT see the order on the "Active orders" tab

  Scenario: about the #1165 issue (failed payment cash/card)
    Given I have a cash/card "NONE" order with 1 "Fanta #2" product
    When the "Placed orders" icon is selected
    And I click on the "Manual payments" icon with title
    Then I should see an order with an id starts with "#"
    And I should see the time of the created order
    When I click on the order with "298 Ft"
    Then I should see the deatils of order
    Then I should see the buttons in "NONE"
    When I click on the "NONE" button next to the product name
    Then I should see the buttons in "PLACED"
    When I click on the "PLACED" button next to the product name
    Then I should see the buttons in "PROCESSING"
    When I click on the "PROCESSING" button next to the product name
    Then I should see the buttons in "READY"
    When I click on the "READY" button next to the product name
    And I click on the "FAILED" button
    Then I should see the unpay modal
    And I should see "Failed transaction. Please select unpay category!" text
    When I click on the "Unpay category" button
    Then I should see 10 options on the list
    When I click on the "Staff meal" option
    And I click on the "OK" button
    Then I should NOT see the order on the "Active orders" tab
    And I click on the "Orders history" tab
    Then I should see the served order selected
    And I should see the "Fanta #2 (glass)" product with "ROOM TEMPERATURE"
    And I should see the red badge with "Failed (Staff meal)" caption
    And I should see the green badge with "served" caption

  Scenario: Report export feature
    When I click on the "Reports" icon with title
    Then I should see "Product mix" table
    When I click on the "Export" button
    Then I should download the product mix export file

#  Scenario: Reports feature
#    When I click on the "Reports" icon with title
#    Then I should see "Paid orders" text
#    Then I should see "Unpaid orders" text
#    When I scroll down to the bottom of the page
#    Then I should see "Rejected orders" text
# Is it necessary?
