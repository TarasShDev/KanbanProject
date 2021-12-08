package pages;

import DTO.TaskInfo;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class BoardPage {

    private WebDriver driver;
    private  WebDriverWait wait;

    @FindBy(css = "h3.logo")
    private WebElement name;

    @FindBy(css = "div.col-sm-3>h2")
    private List<WebElement> columns;

    @FindBy(css = "div.col-sm-3>h2")
    private List<WebElement> columnBodies;

    @FindBy(css = "ul.navbar-nav>li")
    private List<WebElement> options;


    public BoardPage(WebDriver driver) {
        this.driver = driver;
        wait = new WebDriverWait(driver, 120);
        PageFactory.initElements(this.driver, this);

    }

    public void waitPageLoad() {
        wait.until(ExpectedConditions.visibilityOf(columns.get(0)));
    }


    public boolean isPageDisplayed() {
        waitPageLoad();
        return name.isDisplayed();
    }

    public String getBoardName() {
        return name.getText();
    }

    public List<String> getColumnNames() {
        return columns.stream().map(WebElement::getText).collect(Collectors.toList());
    }

    public List<String> getOptions() {
        return options.stream().map(WebElement::getText).collect(Collectors.toList());
    }

    public List<TaskInfo> getTaskInfoForColumn(String columnName) {
       WebElement column= columns.stream().filter(el->el.getText().equalsIgnoreCase(columnName)).findFirst().orElseThrow();
       List<TaskInfo> actualTasks = new ArrayList<>();
       column.findElements(By.xpath(".//following-sibling::ul/li")).forEach(task->
               actualTasks.add(
                       TaskInfo.builder()
                               .title(task.findElement(By.cssSelector("div.taskTitle")).getText())
                               .description(task.findElement(By.cssSelector("div.taskText")).getText())
                               .owner(task.findElements(By.cssSelector("div.taskOwner")).get(1).getText())
                               .prio(task.findElements(By.cssSelector("div.taskOwner")).get(0).getText())
                               .build()));
       return actualTasks;
    }

    public WebElement getOptionByText(String option){
        return options.stream().filter(op->op.getText().contains(option)).findFirst().orElseThrow();
    }

}
