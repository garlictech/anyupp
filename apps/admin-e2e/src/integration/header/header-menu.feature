Feature: Menu lanes

    If you click on the menu button, you can choose between different pages,
    like Products, Product categories or Chains.

 Background: 
   Given I am on the dashboard page

 Scenario Outline: Menupoints 
   When I click on the "menu" button
   When I click on the "<pages>" button
   Then I should be on the "<pages>" page

   Examples:
       | pages              |
       | Products           |
       | Product categories |
       | Chains             |