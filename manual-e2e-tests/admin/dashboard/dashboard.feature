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
