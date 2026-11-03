import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import java.time.Duration;
import static org.junit.jupiter.api.Assertions.*;

public class LoginTest {
    public static void main(String[] args) {

        WebDriver driver = new FirefoxDriver();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));

        try {
            driver.get("https://aldercrest.catlium.in/login");

            driver.findElement(By.cssSelector("input[type='text']"))
                    .sendKeys("student");

            driver.findElement(By.cssSelector("input[type='password']"))
                    .sendKeys("student123");

            driver.findElement(By.cssSelector("button[type='submit']")).click();

            assertEquals("https://aldercrest.catlium.in/login",
                    driver.getCurrentUrl());

            assertTrue(driver.findElement(
                    By.xpath("//*[contains(text(),'Welcome')]")).isDisplayed());

            assertTrue(driver.findElement(
                    By.xpath("//*[contains(text(),'Log out')]")).isDisplayed());

            System.out.println("Login Test Passed!");

        } catch (AssertionError | NoSuchElementException e) {
            System.out.println("Login Test Failed: " + e.getMessage());

        } finally {
            driver.quit();
        }
    }
}