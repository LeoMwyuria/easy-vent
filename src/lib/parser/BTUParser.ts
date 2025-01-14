import { Browser, Page } from "puppeteer";
import puppeteer from "puppeteer";

interface Lesson {
  time: string;
  room: string;
  subject: string;
  group: string;
  lecturer: string;
  additionalInfo: string;
}

export class BTUParser {
  private page!: Page;
  private browser!: Browser;

  async init() {
    console.log("1. Starting browser initialization");
<<<<<<< HEAD
    try {
      this.browser = await puppeteer.launch({
        headless: "new" as any,
        defaultViewport: null,
        args: [
          "--start-maximized",
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
        ignoreDefaultArgs: ["--enable-automation"],
      });

      this.page = await this.browser.newPage();

      // Enable console logging from the page
      this.page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));

      // Enable request interception
      await this.page.setRequestInterception(true);
      this.page.on("request", (request) => {
        if (["image", "stylesheet", "font"].includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });

      // Monitor network responses
      this.page.on("response", async (response) => {
        const url = response.url();
        if (url.includes("schedule")) {
          try {
            const text = await response.text();
            console.log(
              "Response from schedule endpoint:",
              text.substring(0, 200) + "..."
            ); // Log first 200 chars
          } catch (e) {
            console.log("Could not read response:", e);
          }
        }
      });

      await this.page.setDefaultNavigationTimeout(120000);

      console.log("2. Browser initialized");

      // Navigate to main page first
      await this.page.goto("https://classroom.btu.edu.ge/", {
        waitUntil: "networkidle0",
      });

      console.log("3. Checking authentication status");

      // Check if we're on the login page
      const isLoginPage = await this.page.evaluate(() => {
        return window.location.href.includes("login");
      });

      if (isLoginPage) {
        throw new Error("Authentication required. Please log in first.");
      }

      // Navigate to schedule page
      console.log("4. Navigating to schedule page");
      await this.page.goto(
        "https://classroom.btu.edu.ge/ge/student/me/schedule",
        {
          waitUntil: "networkidle0",
        }
      );

      // Wait for table with exponential backoff
      let retryDelay = 1000;
      const maxRetries = 5;

      for (let i = 0; i < maxRetries; i++) {
        try {
          await this.page.waitForSelector(".table-responsive", {
            timeout: retryDelay,
          });
          break;
        } catch (error) {
          console.log(`Retry ${i + 1}: Waiting for schedule table...`);
          if (i === maxRetries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          retryDelay *= 2;
          await this.page.reload({ waitUntil: "networkidle0" });
        }
      }

      console.log("5. Extracting schedule data");

      // Extract schedule data with validation
      const schedule = await this.page.evaluate(() => {
        try {
          const schedule: Record<string, Lesson[]> = {};
          const table = document.querySelector(".table-responsive");

          if (!table) {
            console.error("Table element not found");
            return null;
          }

          // Log table content for debugging
          console.log("Table HTML:", table.innerHTML);

          const rows = table.querySelectorAll("tr");
          console.log("Number of rows found:", rows.length);

          let currentDay = "";

          const dayMappings = {
            ორშაბათი: "monday",
            სამშაბათი: "tuesday",
            ოთხშაბათი: "wednesday",
            ხუთშაბათი: "thursday",
            პარასკევი: "friday",
            შაბათი: "saturday",
          };

          rows.forEach((row, index) => {
            console.log(`Processing row ${index}`);

            // Check for day header
            const headerCell = row.querySelector("td h4");
            if (headerCell) {
              const headerText = headerCell.textContent?.trim() || "";
              console.log("Found header:", headerText);

              const matchedDay = Object.keys(dayMappings).find((day) =>
                headerText.includes(day)
              );
              if (matchedDay) {
                currentDay =
                  dayMappings[matchedDay as keyof typeof dayMappings];
                schedule[currentDay] = [];
                console.log("Current day set to:", currentDay);
              }
            }
            // Process lesson row
            else if (currentDay && row.cells.length >= 6) {
              const cells = Array.from(row.cells).map((cell) => {
                const text = cell.textContent?.trim() || "";
                console.log("Cell content:", text);
                return text;
              });

              const lesson = {
                time: cells[0],
                room: cells[1],
                subject: cells[2],
                group: cells[3],
                lecturer: cells[4],
                additionalInfo: cells[5],
              };

              if (lesson.subject && lesson.subject !== "-") {
                schedule[currentDay].push(lesson);
                console.log("Added lesson:", lesson);
              }
            }
          });

          return schedule;
        } catch (error) {
          console.error("Error in page evaluation:", error);
          return null;
        }
      });

      if (!schedule) {
        throw new Error("Failed to extract schedule data");
      }

      console.log("6. Schedule data extracted successfully");
      return schedule;
    } catch (error) {
      console.error("Error during schedule parsing:", error);
      throw error;
    }
=======
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        "--start-maximized",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
      ignoreDefaultArgs: ["--enable-automation"],
      slowMo: 100,
    });

    this.page = await this.browser.newPage();
    await this.page.setDefaultNavigationTimeout(60000);
    console.log("2. Browser initialized");

    await this.page.goto("https://classroom.btu.edu.ge/ge/student/me/schedule");
    console.log("3. Waiting for login redirect");

    await this.page.waitForFunction(
      () => window.location.href.includes("/student/me/courses"),
      { timeout: 120000 }
    );

    console.log("4. Login successful, detected courses page");

    await this.page.goto("https://classroom.btu.edu.ge/ge/student/me/schedule");
    await this.page.waitForSelector(".table-responsive");
    await this.page.waitForFunction(() => {
      const table = document.querySelector(".table-responsive");
      if (!table) return false;
      const tableElement = table as HTMLElement;
      const content = tableElement.textContent;
      if (!content) return false;
      return content.length > 0;
    });
    console.log("5. Schedule loaded successfully");

    const schedule = await this.page.evaluate(() => {
      const schedule: Record<string, Lesson[]> = {};
      const table = document.querySelector(".table-responsive");
      const rows = table?.querySelectorAll("tr") || [];

      let currentDay = "";
      const dayHeaders = [
        "ორშაბათი",
        "სამშაბათი",
        "ოთხშაბათი",
        "ხუთშაბათი",
        "პარასკევი",
        "შაბათი",
      ];
      const dayMappings = {
        ორშაბათი: "monday",
        სამშაბათი: "tuesday",
        ოთხშაბათი: "wednesday",
        ხუთშაბათი: "thursday",
        პარასკევი: "friday",
        შაბათი: "saturday",
      };

      rows.forEach((row) => {
        const headerCell = row.querySelector("td h4");
        if (headerCell) {
          const headerText = headerCell.textContent?.trim() || "";
          const dayMatch = dayHeaders.find((day) => headerText.includes(day));
          if (dayMatch) {
            currentDay = dayMappings[dayMatch as keyof typeof dayMappings];
            schedule[currentDay] = [];
          }
        } else if (currentDay && row.cells.length >= 6) {
          const lesson = {
            time: row.cells[0]?.textContent?.trim() || "",
            room: row.cells[1]?.textContent?.trim() || "",
            subject: row.cells[2]?.textContent?.trim() || "",
            group: row.cells[3]?.textContent?.trim() || "",
            lecturer: row.cells[4]?.textContent?.trim() || "",
            additionalInfo: row.cells[5]?.textContent?.trim() || "",
          };

          if (lesson.subject && lesson.subject !== "-") {
            schedule[currentDay].push(lesson);
          }
        }
      });

      return schedule;
    });

    console.log("6. Schedule data extracted:", schedule);
    return schedule;
>>>>>>> b25808e0ea8da93c9a5303d07ef07ca0b1090c4f
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
