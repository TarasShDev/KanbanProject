package flows;

import org.openqa.selenium.WebDriver;
import pages.KanbanBoardsPage;

import java.util.List;
import java.util.logging.Logger;

public class BoardsSteps {

    private Logger log = Logger.getLogger(BoardsSteps.class.getName());

    private KanbanBoardsPage kanbanBoardsPage;

    public BoardsSteps(WebDriver driver) {
        kanbanBoardsPage = new KanbanBoardsPage(driver);
    }

    public void openKanbanBoardsPage() {
        log.info("Trying to open Kanban Boards page");
        kanbanBoardsPage.openKanbanBoardsPage();
        kanbanBoardsPage.waitPageLoad();
    }

    public List<String> getAllBoardNames() {
        return kanbanBoardsPage.getAllExistingBoards();
    }

    public void openBoardWithName(String name) {
        kanbanBoardsPage.getBoardWithName(name).click();
    }

    public Boolean isKanbanBoardsPageLoaded() {
        return kanbanBoardsPage.getLogo().isDisplayed();
    }



}
