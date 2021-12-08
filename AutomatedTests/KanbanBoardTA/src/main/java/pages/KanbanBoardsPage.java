package pages;

import lombok.Getter;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.List;
import java.util.stream.Collectors;
@Getter
public class KanbanBoardsPage {

    private WebDriver driver;
    private  final String KANBAN_BOARDS_PAGE_URL = "http://localhost:61661/";
    private  WebDriverWait wait;

    @FindBy(css = "h3.logo")
    private WebElement logo;

    @FindBy(css = "div.board>a")
    private List<WebElement> boardLinks;


    public KanbanBoardsPage(WebDriver driver) {
        this.driver = driver;
        PageFactory.initElements(this.driver, this);
        wait = new WebDriverWait(driver, 20);
    }

    public void openKanbanBoardsPage() {
        driver.manage().window().maximize();
        driver.get(KANBAN_BOARDS_PAGE_URL);
    }


    public void waitPageLoad() {
        wait.until(
                ExpectedConditions.and(
                        ExpectedConditions.visibilityOf(logo))
        );
    }

    public WebElement getBoardWithName(String name){
        return boardLinks.stream().filter(el->el.getText().equalsIgnoreCase(name)).findFirst().orElseThrow();
    }

    public List<String> getAllExistingBoards(){
        return boardLinks.stream().map(WebElement::getText).collect(Collectors.toList());

    }

}
