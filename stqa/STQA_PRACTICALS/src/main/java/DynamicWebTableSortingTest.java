
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class DynamicWebTableSortingTest {

    WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new FirefoxDriver();
        driver.manage().window().maximize();
        driver.get("https://aldercrest.catlium.in/students.html");
    }

    @Test
    public void dynamicTableSortingAndFiltering() {

        // 1. Extract original table data
        List<WebElement> rows = driver.findElements(
                By.cssSelector("#studentTable tbody tr")
        );

        System.out.println("===== ORIGINAL TABLE DATA =====");

        for (WebElement row : rows) {
            List<WebElement> cells = row.findElements(By.tagName("td"));

            System.out.println(
                    cells.get(0).getText() + " | " +
                            cells.get(1).getText() + " | " +
                            cells.get(2).getText()
            );
        }

        Assert.assertEquals(rows.size(), 5);

        // 2. Click Java column header to sort
        driver.findElement(
                By.xpath("//th[contains(.,'Java')]")
        ).click();

        // 3. Extract sorted Java marks
        List<WebElement> sortedRows = driver.findElements(
                By.cssSelector("#studentTable tbody tr")
        );

        List<Integer> actualMarks = new ArrayList<>();

        System.out.println("\n===== SORTED JAVA MARKS =====");

        for (WebElement row : sortedRows) {
            List<WebElement> cells = row.findElements(By.tagName("td"));

            int marks = Integer.parseInt(cells.get(1).getText());
            actualMarks.add(marks);

            System.out.println(cells.get(0).getText() + " = " + marks);
        }

        // 4. Validate ascending sorting
        List<Integer> expectedMarks = new ArrayList<>(actualMarks);
        Collections.sort(expectedMarks);

        Assert.assertEquals(
                actualMarks,
                expectedMarks,
                "Java marks are not sorted correctly"
        );

        System.out.println("PASS: Java marks sorted correctly.");

        // 5. Search for Rahul
        WebElement searchBox = driver.findElement(By.id("search"));
        searchBox.sendKeys("Rahul");

        // 6. Verify filtered results
        List<WebElement> filteredRows = driver.findElements(
                By.cssSelector("#studentTable tbody tr")
        );

        boolean found = false;

        System.out.println("\n===== FILTERED RESULTS =====");

        for (WebElement row : filteredRows) {
            if (row.isDisplayed()) {
                String name = row.findElements(By.tagName("td"))
                        .get(0).getText();

                System.out.println(name);

                Assert.assertTrue(
                        name.toLowerCase().contains("rahul"),
                        "Incorrect filtered result"
                );

                found = true;
            }
        }

        Assert.assertTrue(found, "No matching student found.");

        System.out.println("PASS: Filtering results are correct.");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
