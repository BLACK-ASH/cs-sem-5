import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import java.util.List;

public class WebTable {
    public static void main(String[] args) {

        WebDriver driver = new FirefoxDriver();

        try {
            driver.get("https://aldercrest.catlium.in/students.html");

            List<WebElement> rows = driver.findElements(
                    By.cssSelector("#studentTable tbody tr")
            );

            int total = 0, above60 = 0;

            for (WebElement row : rows) {
                List<WebElement> cells = row.findElements(By.tagName("td"));

                String name = cells.get(0).getText();
                int java = Integer.parseInt(cells.get(1).getText());
                int dbms = Integer.parseInt(cells.get(2).getText());

                total++;

                if (java > 60 || dbms > 60)
                    above60++;

                System.out.println(name + " | Java: " + java
                        + " | DBMS: " + dbms);
            }

            double percentage = (above60 * 100.0) / total;

            System.out.println("\nTotal Students: " + total);
            System.out.println("Students Above 60: " + above60);
            System.out.printf("Percentage: %.2f%%%n", percentage);

        } finally {
            driver.quit();
        }
    }
}
