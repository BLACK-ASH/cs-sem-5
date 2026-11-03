import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.Select;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;


import org.openqa.selenium.*;
import org.testng.annotations.*;

public class DropdownTest {

    WebDriver driver;

    @BeforeMethod
    public void setUp() {
        driver = new FirefoxDriver();
        driver.get("https://aldercrest.catlium.in/controls.html");
    }

    @Test
    public void verifyDropdown() {

        Select dropdown = new Select(
                driver.findElement(By.tagName("select"))
        );

        Assert.assertEquals(dropdown.getOptions().size(), 5);

        System.out.println("Total options: " + dropdown.getOptions().size());

        dropdown.selectByVisibleText("Cloud Computing");
        Assert.assertEquals(
                dropdown.getFirstSelectedOption().getText(),
                "Cloud Computing"
        );
        System.out.println("Selected: Cloud Computing");

        dropdown.selectByIndex(2);
        System.out.println("Selected by index: "
                + dropdown.getFirstSelectedOption().getText());

        dropdown.selectByValue("cyber-security");
        System.out.println("Selected by value: "
                + dropdown.getFirstSelectedOption().getText());

        Assert.assertEquals(
                dropdown.getFirstSelectedOption().getText(),
                "Cyber Security"
        );

        System.out.println("Dropdown Test Passed!");
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}
