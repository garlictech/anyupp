Feature: Inactive products

  Scenario: When the products inactive in a category
    Given the admin set the "Test product category #1 name" products to INACTIVE
    And I am on the login screen
    And the language is set to EN
    When I tap the text "Continue anonymously"
    Then there is a loading screen
    And there is the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then there is the dashboard screen
    And the "Menu" option is selected on the bottom navigator
    Then I should see "The unit has no products yet." text
    #Scenario: the admin set it back to active
    Given the admin set the "Test product category #1 name" products to ACTIVE
    When I tap the map icon
    And I tap the "Change location" button
    Then I should be on the unit selection screen
    When I tap the "Késdobáló #111" unit in the list
    Then I should see "HAMBURGER #1" with picture
    And I should see "FANTA #2" with picture
