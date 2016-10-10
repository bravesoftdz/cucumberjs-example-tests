Feature: Searching for stuff
  As a customer
  I want to be able to search for stuff
  So that I can buy it

  Scenario: A user can search for trousers
    Given I am on the Next web site
    When I search for "trousers"
    Then I see the result beginning "High Waisted Cigarette Trousers"
