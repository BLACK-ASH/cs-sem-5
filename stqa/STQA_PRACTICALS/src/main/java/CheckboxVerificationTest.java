import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.List;

public class CheckboxVerificationTest {

    WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new FirefoxDriver();
        driver.manage().window().maximize();
        driver.get("https://aldercrest.catlium.in/controls.html");
    }

    @Test
    public void verifyCheckboxes() {

        // Identify all checkboxes
        List<WebElement> checkboxes = driver.findElements(
                By.cssSelector("input[type='checkbox']")
        );

        // Count total checkboxes
        int total = checkboxes.size();
        int checked = 0;
        int unchecked = 0;

        for (WebElement checkbox : checkboxes) {
            if (checkbox.isSelected()) {
                checked++;
            } else {
                unchecked++;
            }
        }

        System.out.println("Total checkboxes: " + total);
        System.out.println("Checked checkboxes: " + checked);
        System.out.println("Unchecked checkboxes: " + unchecked);

        // Validate checkbox count
        Assert.assertEquals(total, checked + unchecked);

        // Select all unchecked checkboxes
        for (WebElement checkbox : checkboxes) {
            if (!checkbox.isSelected()) {
                checkbox.click();
            }
        }

        // Verify all checkboxes are selected
        for (WebElement checkbox : checkboxes) {
            Assert.assertTrue(checkbox.isSelected());
        }

        System.out.println("\nAfter dynamic selection:");

        for (int i = 0; i < checkboxes.size(); i++) {
            System.out.println(
                    "Checkbox " + (i + 1) +
                            " selected: " + checkboxes.get(i).isSelected()
            );
        }
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
