Feature: Kanban board workflow

  Scenario: Check the columns for Board
    Given I open Kanban Board home page
    Then I verify Kanban Board is visible
    Then I verify Kanban Board contains following boards:
      | Sample board |
    When I open the page for 'Sample board' board
    Then I verify Kanban Board page is loaded
    And I see following board columns:
      | ToDo  |
      | Doing |
      | Test  |
      | Done  |

  Scenario: Check the tasks for specific column
    Given I open Kanban Board home page
    Then I verify Kanban Board is visible
    Then I verify Kanban Board contains following boards:
      | Sample board |
    When I open the page for 'Sample board' board
    Then I verify Kanban Board page is loaded
    And I see following task information for column 'ToDo':
      | title       | description        | owner | prio |
      | Sample task | Sample description | Taras | #1   |
      | Task2       | Some description   | Sasha | #2   |

  Scenario: Add new task
    Given I open Kanban Board home page
    Then I verify Kanban Board is visible
    Then I verify Kanban Board contains following boards:
      | Sample board |
    When I open the page for 'Sample board' board
    Then I verify Kanban Board page is loaded
    And I see following task information for column 'ToDo':
      | title       | description        | owner | prio |
      | Sample task | Sample description | Taras | #1   |
      | Task2       | Some description   | Sasha | #2   |
    When I click on the +Add Task button
    Then edit modal window appears
    When I fill in edit form with values
      | title    | description         | owner | prio |
      | AutoTask | Automated test task | Test  | #51  |
    And I save the edit form
    And I see following task information for column 'ToDo':
      | title       | description         | owner | prio |
      | Sample task | Sample description  | Taras | #1   |
      | Task2       | Some description    | Sasha | #2   |
      | AutoTask    | Automated test task | Test  | #51  |

