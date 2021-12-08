Feature: Kanban board workflow

  Scenario: Check Kanban Boards Home Page
    Given I open Kanban Board home page
    Then I verify Kanban Board is visible
    Then I verify Kanban Board contains following boards:
      | Sample board |

  Scenario: Check I can open Kanban Board from Boars page
    Given I open Kanban Board home page
    Then I verify Kanban Board is visible
    Then I verify Kanban Board contains following boards:
      | Sample board |
    When I open the page for 'Sample board' board
    Then I verify Kanban Board page is loaded
    And I see board name equals to 'Sample board'
    And I see following board options:
      | + Add Task   |
      | + Add Column |
      | # All Boards |

