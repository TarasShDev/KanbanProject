package pages;

import DTO.TaskInfo;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class EditTaskWindow {

    private WebDriver driver;
    private WebDriverWait wait;

    @FindBy(css = "form.editForm")
    private WebElement form;

    @FindBy(css = "input#taskTitle")
    private WebElement taskTitleInput;

    @FindBy(css = "textarea#taskDescription")
    private WebElement taskDescription;

    @FindBy(css = "input#taskOwner")
    private WebElement taskOwnerInput;

    @FindBy(css = "input#taskPrio")
    private WebElement taskPrioInput;

    @FindBy(css = "button#taskSaveButton")
    private WebElement save;

    public EditTaskWindow(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 5);
        PageFactory.initElements(this.driver, this);

    }

    public void waitFormLoad() {
        wait.until(ExpectedConditions.visibilityOf(taskTitleInput));
    }

    public boolean isFormDisplayed() throws InterruptedException {
        waitFormLoad();
//        Thread.currentThread().wait(2000);
        return taskTitleInput.isDisplayed();
    }

    public EditTaskWindow fillFormWithValue(TaskInfo data) {
        taskTitleInput.sendKeys(data.getTitle());
        taskDescription.sendKeys(data.getDescription());
        taskOwnerInput.sendKeys(data.getOwner());
        taskPrioInput.sendKeys(data.getPrio());
        return this;
    }

    public void saveForm() {
        save.click();
    }
}
