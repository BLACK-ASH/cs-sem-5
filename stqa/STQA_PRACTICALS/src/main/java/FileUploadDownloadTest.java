import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.io.File;

public class FileUploadDownloadTest {

    public static void main(String[] args) throws Exception {

        // File to upload
        String filePath = "/home/ashif/Downloads/upload_test.txt";

        // Download directory
        String downloadPath = "/home/ashif/Downloads/selenium-downloads";

        File folder = new File(downloadPath);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // Configure Firefox downloads
        FirefoxOptions options = new FirefoxOptions();

        options.addPreference("browser.download.folderList", 2);
        options.addPreference("browser.download.dir", downloadPath);
        options.addPreference(
                "browser.helperApps.neverAsk.saveToDisk",
                "text/plain"
        );
        options.addPreference("pdfjs.disabled", true);

        WebDriver driver = new FirefoxDriver(options);

        try {
            driver.manage().window().maximize();

            // Open upload page
            driver.get("https://aldercrest.catlium.in/upload.html");

            System.out.println("Page opened successfully.");

            // Upload file using Selenium
            WebElement uploadInput = driver.findElement(
                    By.cssSelector("input[type='file']")
            );

            uploadInput.sendKeys(filePath);

            // Verify selected file
            String fileName = uploadInput.getAttribute("value");

            if (fileName.contains("upload_test.txt")) {
                System.out.println("PASS: File selected successfully.");
            } else {
                System.out.println("FAIL: File selection failed.");
            }

            // Download examination guidelines
            driver.findElement(
                    By.xpath("//a[contains(@href,'examination-guidelines.txt')]")
            ).click();

            System.out.println("Download started...");

            // Wait for download
            Thread.sleep(3000);

            // Verify downloaded file
            File downloadedFile = new File(
                    downloadPath + "/examination-guidelines.txt"
            );

            if (downloadedFile.exists()) {
                System.out.println("PASS: File downloaded successfully.");
                System.out.println(
                        "File Path: " + downloadedFile.getAbsolutePath()
                );
            } else {
                System.out.println("FAIL: Downloaded file not found.");
            }

        } finally {
            driver.quit();
        }

        System.out.println("Test execution completed.");
    }
}
