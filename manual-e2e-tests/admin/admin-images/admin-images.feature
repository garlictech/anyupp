Feature: Add images on admin

  Background: Login and steps to the Chains
    Given I am on the dashboard as an authenticated superUser
    Then I set the language to EN
    And I select the "Rab lánc #1" chain in the header menu
    And I select the "Nagy csoport #1" group in the header menu
    And I select the "Késdobáló #111" unit in the header menu
    When I click on the menu icon

  Scenario: Add logo and header for a Chain
    And I click on the "Chains" text
    Then the "Chains" title is displayed
    When I click the edit button in the listitem with "Rab lánc #1" content
    And I click on the plus button under the "Logo" text
    Then my files are open
    When I choose an image
    And I click on the "Open"
    Then I get the message "Image uploaded successfully"
    And I click on the plus button under the "Header" text
    Then my files are open
    When I choose an image
    And I click on the "Open"
    Then I get the message "Image uploaded successfully"
    When I click on the "Submit" button
    Then I get the message "Update successful"

  Scenario: Add image for a Product category
    And I click on the "Product categories" text
    Then the "Product categories (EN)" title is displayed
    When I click the edit button in the listitem with "Test product category #1 name" content
    And I click on the minus icon under the "Image" text
    And I click on the plus button under the "Image" text
    Then my files are open
    When I choose an image
    And I click on the "Open"
    Then I get the message "Image uploaded successfully"
    When I click on the "Submit" button
    Then I get the message "Update successful"

  Scenario: Add image for a Chain product
    And I click on the "Product categories" text
    Then the "Products" title is displayed
    When I click the edit button in the listitem with "Test chain product #1 name" content
    And I click on the minus icon under the "Image" text
    And I click on the plus button under the "Image" text
    Then my files are open
    When I choose an image
    And I click on the "Open"
    Then I get the message "Image uploaded successfully"
    When I click on the "Submit" button
    Then I get the message "Update successful"
