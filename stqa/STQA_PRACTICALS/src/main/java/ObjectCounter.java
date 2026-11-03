import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

public class ObjectCounter {
    public static void main(String[] args) {

        WebDriver driver = new FirefoxDriver();

        driver.get("https://aldercrest.catlium.in/elements.html");

        int links = driver.findElements(By.tagName("a")).size();
        int images = driver.findElements(By.tagName("img")).size();
        int buttons = driver.findElements(By.tagName("button")).size();
        int inputs = driver.findElements(By.tagName("input")).size();

        int total = links + images + buttons + inputs;

        System.out.println("WEB PAGE OBJECT COUNT");
        System.out.println("---------------------");
        System.out.println("Links   : " + links);
        System.out.println("Images  : " + images);
        System.out.println("Buttons : " + buttons);
        System.out.println("Inputs  : " + inputs);
        System.out.println("---------------------");
        System.out.println("Total Objects: " + total);

        driver.quit();
    }
}
