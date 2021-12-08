package flows;

import DTO.TaskInfo;
import org.openqa.selenium.WebDriver;
import pages.BoardPage;
import pages.EditTaskWindow;

import java.util.List;
import java.util.logging.Logger;

public class BoardSteps {
    private Logger log = java.util.logging.Logger.getLogger(BoardsSteps.class.getName());

    private BoardPage boardPage;
    private EditTaskWindow editTaskWindow;

    public BoardSteps(WebDriver driver) {
        boardPage = new BoardPage(driver);
        editTaskWindow=new EditTaskWindow(driver);
    }



    public boolean isBoardPageLoaded() {
        return boardPage.isPageDisplayed();
    }

    public String getBoardName() {
        return boardPage.getBoardName();
    }

    public List<String> getOptions() {
        return boardPage.getOptions();
    }

    public List<String> getColumns() {
        return boardPage.getColumnNames();
    }

    public List<TaskInfo> getTaskInfoForColumn(String columnName) {
        return boardPage.getTaskInfoForColumn(columnName);
    }

    public void clickAddTaskButton() {
        boardPage.getOptionByText("+ Add Task").click();
    }

    public Boolean isEditFormVisible() throws InterruptedException {
        return editTaskWindow.isFormDisplayed();
    }

    public void fillInTheEditForm(TaskInfo info) {
        editTaskWindow.fillFormWithValue(info);
    }

    public void saveTaskEditForm() {
        editTaskWindow.saveForm();
    }

}
