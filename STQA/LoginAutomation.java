import org.openqa.selenium.WebDriver;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;

public class LoginAutomation {

    public static void main(String[] args) throws Exception {

        // Launch Firefox browser
        WebDriver driver = new FirefoxDriver();

        // Configure implicit wait
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));

        try {
            // Open login page
            driver.get("https://www.saucedemo.com/");

            // Maximize browser
            driver.manage().window().maximize();

            // Enter username
            WebElement username = driver.findElement(By.id("user-name"));
            username.sendKeys("standard_user");

            // Enter password
            WebElement password = driver.findElement(By.id("password"));
            password.sendKeys("secret_sauce");

            // Click Login button
            WebElement loginButton =
                    driver.findElement(By.id("login-button"));
            loginButton.click();

            // -------------------------------
            // Assertion 1: URL Validation
            // -------------------------------

            String expectedUrl =
                    "https://www.saucedemo.com/inventory.html";

            String actualUrl = driver.getCurrentUrl();

            assertEquals(expectedUrl, actualUrl,
                    "URL validation failed!");

            System.out.println("URL Validation: PASS");

            // ---------------------------------
            // Assertion 2: Products Page
            // ---------------------------------

            WebElement productsTitle =
                    driver.findElement(By.className("title"));

            String actualMessage = productsTitle.getText();

            assertEquals("Products", actualMessage,
                    "Products page validation failed!");

            System.out.println("Products Page Validation: PASS");

            // -------------------------------
            // Assertion 3: Logout Visibility
            // -------------------------------

            // Open menu
            WebElement menuButton =
                    driver.findElement(By.id("react-burger-menu-btn"));

            menuButton.click();

            WebElement logoutButton =
                    driver.findElement(By.id("logout_sidebar_link"));

            assertTrue(logoutButton.isDisplayed(),
                    "Logout button is not visible!");

            System.out.println("Logout Visibility Validation: PASS");

            System.out.println("--------------------------------");
            System.out.println("LOGIN TEST PASSED SUCCESSFULLY");
            System.out.println("--------------------------------");

        } catch (AssertionError e) {

            System.out.println("--------------------------------");
            System.out.println("LOGIN TEST FAILED");
            System.out.println("Reason: " + e.getMessage());
            System.out.println("--------------------------------");

        } finally {

            // Close browser
            driver.quit();
        }
    }
}