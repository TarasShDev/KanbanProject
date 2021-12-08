package stepDefinitions;

import DTO.TaskInfo;
import flows.BoardSteps;
import flows.BoardsSteps;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import junit.framework.TestCase;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static junit.framework.TestCase.assertTrue;
import static org.hamcrest.MatcherAssert.assertThat;

public class MyStepdefinitions {

    private BoardsSteps boardsSteps;
    private BoardSteps boardSteps;
    private WebDriver driver;

    @Before
    public void setUpBrowser() {
        if (null == driver) {
            System.setProperty("webdriver.chrome.driver", "src\\main\\java\\chromedriver.exe");
            driver = new ChromeDriver();
        }
        boardsSteps = new BoardsSteps(driver);
        boardSteps = new BoardSteps(driver);
    }

    @After
    public void closeBrowser() {
        driver.close();
    }

    @Given("^I open Kanban Board home page")
    public void iOpenKanbanBoardHomePage() {
        boardsSteps.openKanbanBoardsPage();
    }

    @Then("^I verify Kanban Board is visible")
    public void iVerifyKanbanBoardIsVisible() {
        assertThat("Kanban Boards Page is not loaded", boardsSteps.isKanbanBoardsPageLoaded().equals(true));
    }

    @Then("I verify Kanban Board contains following boards:")
    public void iVerifyKanbanBoardContainsFollowingBoards(List<String> expectedBoards) {
        assertThat("Kanban Boards Page doesn't contain expected boards", boardsSteps.getAllBoardNames().equals(expectedBoards));
    }

    @When("I open the page for {string} board")
    public void iOpenThePageForSampleBoardBoard(String board) {
        boardsSteps.openBoardWithName(board);
    }

    @Then("I verify Kanban Board page is loaded")
    public void iVerifyKanbanBoardPageIsLoaded() {
        assertThat("", boardSteps.isBoardPageLoaded());
    }

    @Then("I see board name equals to {string}")
    public void iSeeBoardNameEqualsToSampleBoard(String expectedName) {
        assertThat("", boardSteps.getBoardName().equals(expectedName));
    }

    @And("I see following board options:")
    public void iSeeFollowingBoardOptions(List<String> expectedOptions) {
        assertThat("", boardSteps.getOptions().equals(expectedOptions));
    }

    @And("I see following board columns:")
    public void iSeeFollowingBoardColumns(List<String> expectedColumns) {
        assertThat("", boardSteps.getColumns().containsAll(expectedColumns));
    }

    @And("I see following task information for column {string}:")
    public void iSeeFollowingTaskInformationForColumnToDo(String columnName, DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        List<TaskInfo> expectedInfos = new ArrayList<>();
        for (Map<String, String> columns : rows) {
            expectedInfos.add(new TaskInfo(columns.get("title"), columns.get("description"), columns.get("owner"), columns.get("prio")));
        }

//        assertThat("", boardSteps.getTaskInfoForColumn(columnName).containsAll(expectedInfos));

    }

    @When("I click on the +Add Task button")
    public void iClickOnTheAddTaskButton() {
        boardSteps.clickAddTaskButton();
    }

    @Then("edit modal window appears")
    public void editModalWindowAppears() throws InterruptedException {
        assertTrue("", boardSteps.isEditFormVisible());
    }

    @Then("edit modal window is closed")
    public void editModalWindowClosed() throws InterruptedException {
        TestCase.assertFalse(boardSteps.isEditFormVisible());
    }

    @When("I fill in edit form with values")
    public void iFillInEditFormWithValues(DataTable table) {
        List<Map<String, String>> rows = table.asMaps(String.class, String.class);
        TaskInfo info = TaskInfo.builder()
                .title(rows.get(0).get("title"))
                .description(rows.get(0).get("description"))
                .owner(rows.get(0).get("owner"))
                .prio(rows.get(0).get("prio")).build();
        boardSteps.fillInTheEditForm(info);
    }

    @And("I save the edit form")
    public void iSaveTheEditForm() {
        boardSteps.saveTaskEditForm();
    }

}
