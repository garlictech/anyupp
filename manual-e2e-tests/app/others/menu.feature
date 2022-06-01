Feature: Update menu and see the changes in the app

  Background: Basic, in the Kesdobalo#111
    Given I am logged in as an anonym user
    And the language is set to EN
    Then I should see the "Unit selector" screen

  Scenario: The Menu
    When I select the "Késdobáló #111" in in place mode
    And I tap on the mode selector button
    Then I should see "Please select" text
    When I tap on the "Take away" icon
    Then the app switches to take away mode
    When I tap on the qr code icon
    And the app opens my camera
    And I read a seat qr code
    Then I should see "finding table and chair..." loading screen
    Then I should see "Table: #01, Chair: #02" popup
    When I tap on the "OK" button
    Then I should see the product categories
    And I should see "Favorites" category
    And the "Hamburgers" category is selected
    And I should see the products with picture
    And I should see "sajtos szendvics" text on the "Sajtburger" card
    And I should see "1200 Ft - 1500 Ft" text on the "Sajtburger" card
    When I tap on the "Sajtburger" product
    Then I should see the deatils of the product
    When I tap on the close button
    And I tap on the "Favorites" category
    Then I should see "You have not added any favorite items yet." text
    When I tap on the back arrow button
    # exit the unit
    Then I should see the "Unit selector" screen
  # when a product is sold out
  # when a product is not available in an order mode

  Scenario: Admin set one product to inactive
    Given the admin set the "Sajtburger" product to INACTIVE
    And the admin pushes the "Regenerate menu" button
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see "Fishburger" with picture
    And I should see "Hamburger" with picture
    And I should NOT see "Sajtburger"
    When I tap on the back arrow button
    #admin
    When the admin set the "Sajtburger" product to ACTIVE
    And the admin pushes the "Regenerate menu" button
    #app
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see "Sajtburger" with picture

  Scenario: Admin set category (all the products) to inactive
    Given the admin set the "Fishburger" product to INACTIVE
    And the admin set the "Sajtburger" product to INACTIVE
    And the admin set the "Hamburger" product to INACTIVE
    And the admin pushes the "Regenerate menu" button
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see "Non-alcoholic drink" product category
    And I should see "Beers" product category
    And I should NOT see "Hamburgers" product category
    When I tap on the back arrow button
    #admin
    When the admin set the "Sajtburger" product to ACTIVE
    And the admin set the "Fishburger" product to ACTIVE
    And the admin set the "Hamburger" product to ACTIVE
    And the admin pushes the "Regenerate menu" button
    #app
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see the "Menu" screen
    Then I should see "Hamburgers" product category
    And I should see "Sajtburger" with picture
    And I should see "Fishburger" with picture
    And I should see "Hamburger" with picture

  Scenario: Admin adds a new product
    Given the admin adds "Vegaburger" product under the "Hamburgers" category
    And the admin pushes the "Regenerate menu" button
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see "Hamburgers" category is selected
    And I should see "Vegaburger" with picture

  Scenario: Admin modifies the price of a product
    Given the admin sets the "Sajtburger" price to "2000 Ft"
    And the admin pushes the "Regenerate menu" button
    When I pull the "Unit selector" screen to refresh
    And I select the "Késdobáló #111" in in place mode
    Then I should see "Sajtburger" with picture
    When I tap on the "Sajtburger" product
    And I should see "1 x 2000 Ft" text
